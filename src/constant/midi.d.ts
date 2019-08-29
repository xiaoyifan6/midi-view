declare interface NoteJSON {
    time: number;
    midi: number;
    name: string;
    velocity: number;
    duration: number;
    ticks: number;
    durationTicks: number;
}

declare interface InstrumentJSON {
    number: number;
    name: string;
    family: string;
}

declare interface ControlChangeJSON {
    number: number;
    ticks: number;
    time: number;
    value: number;
}


declare interface ControlChangesJSON {
    [key: string]: ControlChangeJSON[];
    [key: number]: ControlChangeJSON[];
}

declare interface TrackJSON {
    name: string;
    notes: NoteJSON[];
    channel: number;
    instrument: InstrumentJSON;
    controlChanges: ControlChangesJSON;
}

declare interface TimeSignatureEvent {
    ticks: number;
    timeSignature: number[];
    measures?: number;
}

declare interface MetaEvent {
    text: string;
    type: string;
    ticks: number;
}

declare interface KeySignatureEvent {
    ticks: number;
    key: string;
    scale: string;
}

declare interface TempoEvent {
    ticks: number;
    bpm: number;
    readonly time?: number;
}

declare interface HeaderJSON {
    name: string;
    ppq: number;
    meta: MetaEvent[];
    tempos: TempoEvent[];
    timeSignatures: TimeSignatureEvent[];
    keySignatures: KeySignatureEvent[];
}

/**
 * The MIDI data in JSON format
 */
export interface MidiJSON {
    header: HeaderJSON;
    tracks: TrackJSON[];
}
