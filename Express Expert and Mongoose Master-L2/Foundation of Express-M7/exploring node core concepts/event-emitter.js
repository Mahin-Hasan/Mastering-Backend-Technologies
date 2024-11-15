const EventEmitter = require('events') // here EventEmitter is a class 

const myEmitter = new EventEmitter // need to create instance as it is a class

//listener

myEmitter.on('birthday',()=>{
    console.log('Happy birthday to you');
})
myEmitter.on('birthday',(gift)=>{
    console.log(`I will send a ${gift}`);
})

// myEmitter.emit('birthday')
myEmitter.emit('birthday','watch')

/*
based on birthday two event listener is created  

*/