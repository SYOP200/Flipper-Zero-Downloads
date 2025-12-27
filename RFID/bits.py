"""
Utilities for working with bitstreams
"""
import re
import numpy
from flipper_raw_rfid.utils import batched, Peak
import numpy.typing as npt


def decode_lengths(pads: npt.NDArray[numpy.int64], peaks: list[Peak]) -> tuple[npt.NDArray[numpy.int8], int]:
    """
    Loops through pulses and durations and matches them to peaks
    Checks for the length of the peak as a multiple of the first peak and adds as many 1/0 to the result

    :param pads: Pulse and duration values
    :param peaks: A list of peaks from find_peaks, the center frequencies should be more or less multiples of the first peak
    :return: The decoded bitstream
    """
    result: list[int] = []
    position = 0
    result_position = None
    first_length = peaks[0].center
    for high, duration in pads:
        low = duration - high

        high_peak = None
        low_peak = None

        for p in peaks:
            if high in p:
                high_peak = p
            if low in p:
                low_peak = p
            if high_peak and low_peak:
                break

        if not (high_peak and low_peak):
            if not high_peak:
                print(f'Found nothing for high {high}, restarting')
            if not low_peak:
                print(f'Found nothing for low {low}, restarting')
            result = []
            result_position = position
            continue

        result.extend([1] * int(round(high_peak.center / first_length)))
        result.extend([0] * int(round(low_peak.center / first_length)))
        position += duration

    return numpy.array(result, dtype=numpy.int8), result_position


def decode_manchester(manchester: npt.NDArray[numpy.int8], biphase: bool = True) -> npt.NDArray[numpy.int8]:
    """
    Decode manchester encoded bitstream
    :param manchester: manchester encoded bitstream
    :param biphase: True for biphase, False for diphase
    :return: decoded bitstream
    """
    if manchester[0] == manchester[1]:
        manchester = manchester[1:]

    result = []
    for pair in batched(manchester, 2):
        if len(pair) < 2:
            break
        assert pair[0] != pair[1]
        result.append(pair[0 if biphase else 1])

    return numpy.array(result, dtype=numpy.int8)


def to_str(bits: npt.NDArray[numpy.int8]) -> str:
    """
    Convert a bitstream to a string
    :param bits:
    :return:
    """
    return ''.join(str(b) for b in bits)


def find_pattern(bits: npt.NDArray[numpy.int8], pattern: str | re.Pattern[str]) -> npt.NDArray[numpy.int8] | None:
    bitstring = ''.join(str(b) for b in bits)
    m = re.search(pattern, bitstring)
    if not m:
        return None

    return bits[m.start(0):m.end(0)]


def decode_em_4100(bits: npt.NDArray[numpy.int8]) -> npt.NDArray[numpy.int8]:
    """
    Decode bitstream as EM 4100

    :param bits: bitstream
    :return: decoded nibbles


    EM 4100
    has a header of 9 '1's
    111111111

    followed by 10 nibbles (4 bits each) of data plus one parity bit
    1010 0
    1000 1
    ...

    followed by 4 column parity bits and a final 0

    0010 0

    """

    em4100_bits = find_pattern(bits, r'1{9}.{54}0')

    datagrid = em4100_bits[9:].reshape((11, 5))

    column_parity = datagrid[:, :4].sum(axis=0)
    assert numpy.all(column_parity % 2 == 0)
    row_parity = datagrid[:10].sum(axis=1)
    assert numpy.all(row_parity % 2 == 0)
    nibbles = (datagrid[:10, :4] * [8, 4, 2, 1]).sum(axis=1)

    return numpy.array(nibbles, dtype=numpy.int8)


def longest_run(bits: npt.NDArray[numpy.int8], value: int = 1) -> int:
    """
    Find the longest run of a value (1/0) in a bitstream

    :param bits: the bitstream
    :param value: the value to look for
    :return: index of the first bit of the longest run
    """
    longest = 0
    current = 0
    longest_i = None

    for i, b in enumerate(bits):
        if b != value:
            current = 0
            continue
        current += 1
        if current > longest:
            longest = current
            longest_i = i

    return longest_i - longest + 1
