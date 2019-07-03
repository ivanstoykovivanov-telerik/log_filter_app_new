export class Log{
    constructor(
        private date: string, 
        private time: string, 
        private type: string,
        private contents: string[]
    ){}
}