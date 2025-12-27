"""
Some useful functions not used in the main code yet
"""
from typing import Any, Generator

import numpy
import numpy.typing as npt

from flipper_raw_rfid.utils import find_peaks


def correlation_offset(d1: npt.NDArray[numpy.int32], d2: npt.NDArray[numpy.int32]) -> int:
    """
    Find the offset where two signals would correlate best
    :param d1:
    :param d2:
    :return:
    """
    middle = len(d1) // 2
    cor = numpy.correlate(d1, d2, mode='same')
    return find_peaks(cor)[0].center - middle


def roll(a: npt.NDArray[Any], shift: int) -> npt.NDArray[Any]:
    """
    Like numpy roll but with padding instead of wrapping around
    :param a: array
    :param shift: amount to shift
    :return: shifted array
    """
    if shift > 0:
        return numpy.pad(a[:-shift], (shift, 0))
    else:
        return numpy.pad(a[-shift:], (0, -shift))


def rationalizations(x: float, rtol: float = 1e-05, atol: float = 1e-08) -> Generator[tuple[int, int], None, None]:
    """
    Find short rational approximations of a float

    :param x: the float to approximate
    :param rtol: Relative tolerance, see numpy.isclose
    :param atol: Absolute tolerance, see numpy.isclose
    :return: numerator and denominator of the approximation
    """
    assert 0 <= x
    ix = int(x)
    yield ix, 1
    if numpy.isclose(x, ix, rtol, atol):
        return
    for numer, denom in rationalizations(1.0 / (x - ix), rtol, atol):
        yield denom + ix * numer, numer


def find_fundamental(fs: list[float], rtol: float = 1e-3) -> tuple[float, npt.NDArray[numpy.int32]]:
    """
    Find the fundamental frequency of a list of frequencies

    :param fs: frequencies
    :param rtol: Relative tolerance, see numpy.isclose
    :return: fundamental frequency and multiplication factors for each frequency in fs
    """
    f0 = fs[0]
    res = numpy.zeros((len(fs), 2), dtype=numpy.int32)
    for i, f in enumerate(fs):
        res[i] = list(rationalizations(f0 / f, rtol=rtol))[-1]

    lcm = numpy.lcm.reduce(res[:, 0])
    common = (lcm // res[:, 0] * res.T)[1]
    return numpy.mean(fs / common), common
