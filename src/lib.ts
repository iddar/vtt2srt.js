// https://github.com/AhmedOS/VTT-to-SRT-Converter/blob/master/WebVTT-to-SubRip-Converter/Core/WebvttSubripConverter.cs#L78-L96

export const IsTimecode = (line: string): boolean => line.includes('-->')

export function DeleteCueSettings(line: string):string {
  let output: string = "";
  let ch: string = ''

  for (ch of line.replace('.', ',')) {
      let chLower = ch.toLowerCase();
      if (chLower >= 'a' && chLower <= 'z') {
          break;
      }
      output += ch;
  }

  return output;
}