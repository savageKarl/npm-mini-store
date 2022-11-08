增加功能


app里面有store


惰性渲染




多个store

用ts进行开发

虽然直接store.xxxx 修改， 然后 this.update，很好，但是很容易让用户不知所云，以及这种方式不好追踪bug



所以我决定首先用typescript进行重写。

 - 然后在store里面，增加computed
 -  可以使用多个store
 -  然后将store挂载到 this上，而不是this.data
 - 状态更新得机制采用惰性更新，只更新当前页面得
