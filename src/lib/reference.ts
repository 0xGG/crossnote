import Token from "markdown-it/lib/token";

export interface Reference {
  parentToken: Token;
  token: Token;
  text: string;
  link: string;
}

export class ReferenceMap {
  public map: { [key: string]: { [key: string]: Reference[] } };
  constructor() {
    this.map = {};
  }

  public addReference(
    noteFilePath: string,
    referredByNoteFilePath: string,
    reference: Reference,
  ) {
    if (noteFilePath === referredByNoteFilePath) {
      return;
    }
    if (noteFilePath in this.map) {
      const mentionedBys = this.map[noteFilePath];
      if (referredByNoteFilePath in mentionedBys) {
        mentionedBys[referredByNoteFilePath].push(reference);
      } else {
        mentionedBys[referredByNoteFilePath] = [reference];
      }
    } else {
      this.map[noteFilePath] = {
        [referredByNoteFilePath]: [reference],
      };
    }
  }

  public deleteReferences(
    noteFilePath: string,
    referredByNoteFilePath: string,
  ) {
    if (noteFilePath === referredByNoteFilePath) {
      return;
    }
    if (noteFilePath in this.map) {
      if (referredByNoteFilePath in this.map[noteFilePath]) {
        delete this.map[noteFilePath][referredByNoteFilePath];
      }
    }
  }

  public hasRelation(filePath1: string, filePath2: string) {
    return (
      (filePath1 in this.map && filePath2 in this.map[filePath1]) ||
      (filePath2 in this.map && filePath1 in this.map[filePath2]) ||
      filePath1 === filePath2
    );
  }

  public getReferences(
    noteFilePath: string,
    referredByNoteFilePath: string,
  ): Reference[] {
    if (noteFilePath in this.map) {
      if (referredByNoteFilePath in this.map[noteFilePath]) {
        return this.map[noteFilePath][referredByNoteFilePath];
      }
    }
    return [];
  }

  public noteHasReferences(filePath: string): boolean {
    return filePath in this.map;
  }
}
