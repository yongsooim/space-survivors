
export class WorkerApi {    

    public cmd =''
    public data:any

    consturct(cmd:string, data:any){
        this.cmd = cmd
        this.data = data
    }
}

