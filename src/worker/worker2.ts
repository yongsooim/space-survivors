import sabWorker1 from "./sabManage";


let a: Float64Array
onmessage = (ev) => {
  a = new Float64Array(ev.data);
};

setInterval(()=>{
  console.log(a[0])
}, 500)

export default Worker
