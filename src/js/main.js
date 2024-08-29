const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

// Set config defaults when creating the instance
//const newAxius = axios.create({ //criando nova instancia
   // baseURL: 'https://api.example.com'
 // });
  
  // Alter defaults after instance has been created
 // newAxius.defaults.headers.common['Authorization'] = `new Axius`;

axios.interceptors.request.use(function (config) { //interceptar uma requisição antes dela retornar
    console.log('helo')//usamos interceptadores geralmente quando se pede tolken
    return config;
});

axios.interceptors.response.use(function (response) {//tratando erro global
    console.log('sucess')
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    console.log(error.response) //colocando esse aqui não preciso colocar o catch em cada requisição para tratar erro
    console.log('error!!!')
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

const get = () => { //pegar os dados e configurar
    const config = {
        params: {
            _limit: 5
        }
    };
    axios.get('posts', config)
        .then((response) => renderOutput(response))
}

const post = () => { //postar os dados
    const data = {
        title: 'LaraVue',
        body: 'bar',
        userId: 1,
    };
    axios.post('posts', data)
        .then((response) => renderOutput(response))
}

const put = () => { //o put é para atualizar tudo do post1
    const data = {
        title: 'LaraVue',
        body: 'bar',
        userId: 1,
    };
    
    axios.put('https://jsonplaceholder.typicode.com/posts/1', data)
        .then((response) => renderOutput(response))
}


const patch = () => { //o patch serve para atualizar apenas uma coisa no post1
    console.log('post1 atualizado');
    const data = {
        title: 'LaraVueAtualizado', //LaraVueAtualizado
        body: 'bar',
        userId: 1,
    };
    
    axios.put('https://jsonplaceholder.typicode.com/posts/1', data)
        .then((response) => renderOutput(response))
}

const del = () => { //retorna objeto vazio
    axios.delete('https://jsonplaceholder.typicode.com/posts/2', data)
    .then((response) => renderOutput(response))
}

const multiple = () => { //ele só traz o .Then depois que as duas requisições retornarem]
    Promise.all([
        axios.get('posts'),
        axios.get('users'),

    ]).then((response) => {
        console.log(response);
    })
   
}

const transform = () => { //dados transformados em string
    const config = {
        params: {
            _limit: 5
        },  transformResponse: [function (data) { //para transformar os dados como era antes tem que add a const paylod e tirar o return data
            const payload = JSON.parse(data); // const payload = JSON.parse(data); 
            return payload //return payload
             //return data --- retirado
          }],
          
        
      
    };
    
    axios.get('posts', config)
        .then((response) => renderOutput(response))
}

//tratamento de erro
const errorHandling = () => { //add um Z ao posts para gerar o erro 404
    axios.get('https://jsonplaceholder.typicode.com/postsz')
        .then((response) => renderOutput(response))
        .catch((error)=>renderOutput(error.response))
}

const cancel = () => { //cancelando uma solicitação 
    const controller = new AbortController();
    const config = {
        params: {
            _limit: 5
        },
     signal: controller.signal
    };
    axios.get('posts', config)
        .then((response) => renderOutput(response))
        .catch((e)=> {
            console.log(e.message);
        })

        controller.abort()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
