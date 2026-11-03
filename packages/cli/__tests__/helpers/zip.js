// biome-ignore-all lint/style/noMagicNumbers: zip header field offsets and sizes
import { crc32 } from 'node:zlib'

const UNIX_FILE = 0o10_0644
const UNIX_DIR = 0o04_0755
const UNIX_SYMLINK = 0o12_0777
// "Made by" Unix (3, high byte), spec version 2.0 (20, low byte), so the
// Unix modes in the external attributes count.
const MADE_BY_UNIX = 0x03_14
// 1980-01-01 in DOS date format (day 1, month 1 << 5, year 0 << 9).
const DOS_DATE = 33

/**
 * Builds a stored (uncompressed) zip in memory, so tests can craft entries no
 * zip tool would write (traversal names, symlinks).
 * @param {Array<{ name: string, data?: string, symlink?: string }>} entries
 *   Names ending in `/` are directories; `symlink` makes a link to that target.
 * @returns {Buffer}
 */
export let buildZip = (entries) => {
  let locals = []
  let centrals = []
  let offset = 0

  for (let entry of entries) {
    let isDir = entry.name.endsWith('/')
    let data = Buffer.from(entry.symlink ?? entry.data ?? '')
    let name = Buffer.from(entry.name)
    let mode = isDir ? UNIX_DIR : UNIX_FILE
    if (entry.symlink) {
      mode = UNIX_SYMLINK
    }
    let crc = crc32(data)

    let local = Buffer.alloc(30)
    local.writeUInt32LE(0x04_03_4b_50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0, 6)
    local.writeUInt16LE(0, 8)
    local.writeUInt16LE(0, 10)
    local.writeUInt16LE(DOS_DATE, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28)
    locals.push(local, name, data)

    let central = Buffer.alloc(46)
    central.writeUInt32LE(0x02_01_4b_50, 0)
    central.writeUInt16LE(MADE_BY_UNIX, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(0, 12)
    central.writeUInt16LE(DOS_DATE, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(mode * 0x1_00_00, 38)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, name)

    offset += local.length + name.length + data.length
  }

  let centralDirectory = Buffer.concat(centrals)
  let end = Buffer.alloc(22)
  end.writeUInt32LE(0x06_05_4b_50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(centralDirectory.length, 12)
  end.writeUInt32LE(offset, 16)

  return Buffer.concat([...locals, centralDirectory, end])
}
