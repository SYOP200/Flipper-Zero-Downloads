from __future__ import annotations

from dataclasses import dataclass, field
from itertools import islice, pairwise
from typing import Iterable, Any, Generator, cast

import numpy
import numpy.typing as npt
from scipy.ndimage import gaussian_filter1d
from scipy.signal import find_peaks as scipy_signal_find_peaks
from scipy.optimize import minimize_scalar
from skimage.filters import threshold_otsu

try:
    # python 3.12?
    from itertools import batched  # type: ignore[attr-defined]
except ImportError:
    def batched(iterable: Iterable[Any], n: int) -> Iterable[tuple[Any, ...]]:
        # batched('ABCDEFG', 3) --> ABC DEF G
        if n < 1:
            raise ValueError('n must be at least one')
        it = iter(iterable)
        while batch := tuple(islice(it, n)):
            yield batch


def pad_to_signal(pulse_and_durations: npt.NDArray[numpy.int64]) -> npt.NDArray[numpy.int8]:
    """
    Convert pulse and duration values from flipper to a binary (0/1) signal

    :param pulse_and_durations: The pulse and duration values
    :return: reconstructed signal
    """
    length = pulse_and_durations[:, 1].sum()
    signal = numpy.zeros(length, dtype=numpy.int8)

    position = 0
    for pulse, duration in pulse_and_durations:
        # Fill signal with ones for pulse
        signal[position:position + pulse] = 1
        # Fill signal with zeros for the rest of the duration (not needed, because signal default to zero, just for clarity)
        # signal[position+pulse:position+duration] = 0
        position += duration

    return signal


def signal_to_pad(signal: npt.NDArray[numpy.int8]) -> npt.NDArray[numpy.int64]:
    """
    Convert a binary (0/1) signal to pulse and duration values like used in flipper

    :param signal: The signal
    :return: Pulse and duration values
    """
    def it(s: npt.NDArray[numpy.int8]) -> Generator[tuple[int, int], None, None]:
        position = -1
        changes = numpy.where(s[:-1] != s[1:])[0]
        for p in batched(changes, 2):
            if len(p) == 2:
                yield p[0] - position, p[1] - position
                position = p[1]

        if len(p) == 1:
            yield p[0] - position, len(s) - position - 1

    return numpy.array(list(it(signal)))


def find_first_transition_index(signal: npt.NDArray[numpy.int8], to: int = 1) -> int:
    """
    Find the first index in the signal where it transitions to `to

    :param signal: the signal
    :param to: the value to transition to
    :return: index of the first transition
    """
    # Array of the first 2 indices where there is a transition in any direction
    changes = (signal[:-1] != signal[1:]).nonzero()[0][:2] + 1
    # One of them is the change to the requested `to` value
    needed_index = (signal[changes] == to).nonzero()[0][0]

    change_index = changes[needed_index]
    # Some clarity after too much numpy magic ;)
    assert signal[change_index] == to
    assert signal[change_index - 1] != to

    return cast(int, change_index)


@dataclass
class Peak:
    """
    A peak in a distribution described by left, center and right index
    """
    left: int = field(compare=False)
    center: int = field(compare=False)
    right: int = field(compare=False)
    height: float = field(default=0.0, repr=False)

    def merge(self, other: Peak) -> Peak:
        """
        Merge this peak with another peak
        :param other: Peak to merge with
        :return: merged peak
        """
        return Peak(
            min(self.left, other.left),
            (self.center + other.center) // 2,
            max(self.right, other.right),
            max(self.height, other.height)
        )

    def slice(self, distribution: npt.NDArray[Any]) -> npt.NDArray[Any]:
        """
        Slice the distribution with the peak

        :param distribution:
        :return:
        """
        return distribution[self.left:self.right]

    def fit(self, distribution: npt.NDArray[Any], quantile: float = 1.0) -> Peak:
        """
        Fit the distribution to the peak
        :param distribution:
        :param quantile:
        :return:
        """
        my_excerpt = distribution[self.left:self.right]
        if quantile < 1.0:
            to_capture = numpy.sum(my_excerpt) * quantile

            def objective(thr: float) -> float:
                # 1.0 for capturing enough and a little nudge to find bigger thresholds
                return cast(float, 1.0 * (to_capture > numpy.sum(my_excerpt[my_excerpt > thr])) - thr * 0.0001)

            res = minimize_scalar(objective, (0, my_excerpt.max()))
            threshold = int(res.x)
        else:
            threshold = 0

        first, *_, last = (my_excerpt > threshold).nonzero()[0]

        return Peak(
            self.left + first - 1,
            self.left + (first + last) // 2,
            self.left + last + 1,
            my_excerpt[first:last].max()
        )

    def __contains__(self, v: float | int) -> bool:
        """
        Check if a value is inside the peak
        :param v: value to check
        :return:
        """
        return self.left <= v <= self.right


def histogram(values: npt.NDArray[Any], min_length: int = None) -> npt.NDArray[numpy.int32]:
    """
    Calculate a stupid histogram of a distribution, each value is it's own "bin"

    :param values: The values to count
    :param min_length: Optional minimum length of histogram
    :return: histogram
    """
    length = max(values.max() + 20, min_length or 0)
    hist = numpy.zeros(length, dtype=numpy.int32)
    for v in values:
        hist[v] += 1
    return hist


def find_peaks(distribution: npt.NDArray[Any], min_height: float = None, separate_peaks: bool = True) -> list[Peak]:
    """
    Simple wrapper around scipy.signal.find_peaks auto-tuned for histograms and sorted Peak[] as return value

    :param distribution: The signal to analyze
    :param min_height: optional minimum height for peaks, if None, mean of distribution is used
    :param separate_peaks:  if True, separate peaks that have overlap via otsu thresholding
    :return: array of Peak
    """
    if min_height is None:
        min_height = numpy.mean(distribution)
    peaks_center, pd = scipy_signal_find_peaks(distribution, height=min_height, prominence=min_height)
    peaks = [Peak(l, c, r, h) for c, l, r, h in zip(peaks_center, pd['left_bases'], pd['right_bases'], pd['peak_heights'])]

    # Separate peaks that have overlap
    if separate_peaks:
        for left, right in pairwise(sorted(peaks, key=lambda p: p.center)):
            if left.right > right.left:
                left.right = right.left = left.left + threshold_otsu(hist=distribution[left.left:right.right])

    return sorted(peaks, key=lambda p: p.height, reverse=True)


def autocorrelate(x: npt.NDArray[Any]) -> npt.NDArray[numpy.float32]:
    """
    Calculate fast statistical autocorrelation

    :param x: signal
    :return: autocorrelation of signal

    taken from:
    https://stackoverflow.com/a/51168178
    autocorr3 / fft, pad 0s, non partial
    """
    n = len(x)
    # pad 0s to 2n-1
    ext_size = 2 * n - 1
    # nearest power of 2
    fsize = 2 ** numpy.ceil(numpy.log2(ext_size)).astype('int')

    xp = x - numpy.mean(x)
    var = numpy.var(x)

    # do fft and ifft
    cf = numpy.fft.fft(xp, fsize)
    sf = cf.conjugate() * cf
    corr = numpy.fft.ifft(sf).real
    corr = corr / var / n

    return (corr[:len(corr) // 2]).astype(numpy.float32)


def smooth(signal: npt.NDArray[numpy.int8], sigma: float = 10) -> npt.NDArray[numpy.float32]:
    """
    Apply gaussian filtering to signal

    :param signal: The input signal
    :param sigma: sigma for gaussian filter, how much smoothing
    :return: smoothed signal
    """
    return cast(npt.NDArray[numpy.float32], gaussian_filter1d(numpy.float32(signal), sigma=sigma, mode='nearest'))


def binarize(signal: npt.NDArray[numpy.float32], threshold: float = 0.5) -> npt.NDArray[numpy.int8]:
    """
    Binarize (0/1) signal with threshold

    :param signal: The input signal
    :param threshold: threshold for binarization
    :return: binarized signal
    """
    return (signal > threshold).astype(numpy.int8)


__all__ = ['signal_to_pad', 'pad_to_signal', 'smooth', 'binarize', 'autocorrelate', 'batched', 'Peak', 'find_first_transition_index', 'find_peaks', 'histogram']
