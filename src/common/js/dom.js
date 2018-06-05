//将dom函数进行封装
export function addClass(el,className) {
if(hasClass(el,className)){
  return
}
let newClass=el.class.split('')
  newClass.push(className)
  el.class=newClass.join('')
}
export function hasClass(el,className) {
  let reg=new RegExp('(^|\\s)'+className+'(\\s|$)')
  return reg.test(el.className)
}
//得到dom节点的值，有就get，没有就set
export  function getData(el,name,val) {
  const prefix='data-'
  name=prefix+name
  if(val){
    return el.setAttribute(name,val)
  }else{
    return el.getArribute(name)
  }
}
