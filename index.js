import Vue from '@/Vue';


module.hot && module.hot.accept();

const app = new Vue({
    el: '#app',

    data() {
        return {
            name: 'CJL',
            age: 23,
            obj: {
                a: { b: 'b' },
                arr: [1, 2, { obj: {} }]
            },
            arr: [1, { a: 1 }, { b: 2 }, ['nested', []]]
        };
    },

    // template: `<div id="#app"></div>`,

    computed: {
        nameAndAge() {
            // console.log('computed get...')
            return `name: ${this.name}, age: ${this.age}`;
        },
        nameAndAgeSet: {
            get() {
                return `name: ${this.name}, age: ${this.age}`;
            },
            set(age) {
                this.age = age;
            }
        }
    },

    watch: {
        name(newVal, oldVal) {
            console.log('watch', { newVal, oldVal, self: this });
        }
    },

    methods: {
        testMethod() {
            console.log('methods test', this);
            this.name = 'methods test';
        }
    }
});

window.app = app;



// **响应式 & `diff` 测试**
// app.name = 'TEST';
// app.age = 18;

// app.arr.push('Test Array');
// app.arr[1] = { test: 'arrTest' };
// app.arr[2].b = 10;

setTimeout(() => {
    app.arr[3][1].push('nested test')
}, 1000);

// app.$nextTick(() => {
//     console.log(document.querySelector('#app').innerHTML);
// });



// **computed测试**
// app.name = 'Computed Test'
// app.nameAndAgeSet = 39;



// **watch测试**
// app.$watch(() => app.nameAndAge, function (newVal, oldVal) {
//     console.log({ newVal, oldVal, self: this });
// });
// app.name = 'newName';



// **methods**测试
app.testMethod();