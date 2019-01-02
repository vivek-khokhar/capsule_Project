export default class MainComponent{
    constructor(){
        
        this.utils= new Utils();
        this.render();
    }
    render(){

        let routes = {
            '/':HomeComponent,
            '/products/:id':ProductPage,
            '/cart' : CartComponent,
            '/signin' : SigninComponent,
            '/signup' : SignupComponent
        }
        let router=()=>{
            const content = document.getElementsByClassName('.content');
    
            let request = this.utils.parseRequestURL();
            let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');
            let page = routes[parsedURL] ? routes[parsedURL] : Error404
            if(parsedURL == '/cart'){
                new page("#overlay",request);
            }else{
                new page(".content",request);
            }
        }
        window.addEventListener('hashchange',()=>{router();});
        window.addEventListener('load',()=>{router();});
    }
}
new MainComponent();