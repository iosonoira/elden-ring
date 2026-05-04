/**
 * Caveman Parser for Elden Ring .sl2 save files.
 * Based on Elden-Ring-Automatic-Checklist logic.
 */

export interface CharacterSlot {
  index: number;
  name: string;
  active: boolean;
}

export interface InventoryItem {
  id: string;
  raw: Uint8Array;
}

export class SaveParser {
  private buffer: ArrayBuffer;
  private uint8: Uint8Array;

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer;
    this.uint8 = new Uint8Array(buffer);
  }

  isValid(): boolean {
    // BND4 check
    const header = this.uint8.slice(0, 4);
    return header[0] === 66 && header[1] === 78 && header[2] === 68 && header[3] === 52;
  }

  getCharacterNames(): CharacterSlot[] {
    const names: CharacterSlot[] = [];
    const decoder = new TextDecoder('utf-16le');
    
    // Original offsets from script.js
    const offsets = [
      0x1901d0e, 0x1901f5a, 0x19021a6, 0x19023f2, 0x190263e, 
      0x190288a, 0x1902ad6, 0x1902d22, 0x1902f6e, 0x19031ba
    ];

    for (let i = 0; i < 10; i++) {
      const offset = offsets[i];
      if (offset === undefined) continue;
      const nameBuffer = this.uint8.slice(offset, offset + 32);
      let name = decoder.decode(nameBuffer).replace(/\0/g, '').trim();
      
      names.push({
        index: i,
        name: name || '',
        active: name.length > 0
      });
    }
    
    return names;
  }

  private getSlotBuffer(index: number): Uint8Array {
    // Slot offsets from script.js
    const slotOffsets = [
      [0x00000310, 0x0028030f],
      [0x00280320, 0x050031f],
      [0x0500330, 0x078032f],
      [0x00780340, 0x0a0033f],
      [0x0a00350, 0x0c8034f],
      [0x0c80360, 0x0f0035f],
      [0x0f00370, 0x118036f],
      [0x1180380, 0x140037f],
      [0x1400390, 0x168038f],
      [0x16803a0, 0x190039f]
    ];
    
    const range = slotOffsets[index];
    if (!range || range[0] === undefined || range[1] === undefined) {
      throw new Error(`Invalid slot index or range: ${index}`);
    }
    const [start, end] = range;
    return this.uint8.subarray(start, end + 1);
  }

  getInventoryIds(slotIndex: number): { ids: string[], isDlc: boolean } {
    const slot = this.getSlotBuffer(slotIndex);
    const vanillaPattern = new Uint8Array([0xB0, 0xAD, 0x01, 0x00, 0x01, 0xFF, 0xFF, 0xFF]);
    const dlcPattern = new Uint8Array([0xB0, 0xAD, 0x01, 0x00, 0x01]);
    
    let isDlc = false;
    let index = this.findPattern(slot, vanillaPattern);
    
    if (index !== -1) {
      index += vanillaPattern.length + 8;
    } else {
      index = this.findPattern(slot, dlcPattern);
      if (index !== -1) {
        index += dlcPattern.length + 3;
        isDlc = true;
      }
    }

    if (index === -1) return { ids: [], isDlc: false };

    // Find end of inventory (50 zero bytes)
    const subSlot = slot.subarray(index);
    const zeroPattern = new Uint8Array(50).fill(0);
    const endIndex = this.findPattern(subSlot, zeroPattern);
    
    const inventoryBuffer = subSlot.subarray(0, endIndex !== -1 ? endIndex + 6 : subSlot.length);
    const chunkSize = isDlc ? 8 : 16;
    const ids: string[] = [];

    for (let i = 0; i < inventoryBuffer.length; i += chunkSize) {
      const chunk = inventoryBuffer.slice(i, i + chunkSize);
      if (chunk.length >= 4) {
        // Reverse first 4 bytes and convert to hex
        const idBytes = chunk.slice(0, 4).reverse();
        let idHex = '';
        for (const byte of idBytes) {
          idHex += byte.toString(16).padStart(2, '0');
        }
        ids.push(idHex.toUpperCase());
      }
    }

    return { ids, isDlc };
  }

  private findPattern(data: Uint8Array, pattern: Uint8Array): number {
    for (let i = 0; i < data.length - pattern.length; i++) {
      let match = true;
      for (let j = 0; j < pattern.length; j++) {
        if (data[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) return i;
    }
    return -1;
  }
}
