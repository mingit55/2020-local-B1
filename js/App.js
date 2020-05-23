class App {
    cartList = [];

    constructor(){
        // #0   자주 사용하는 DOM 저장하기
        this.storeElem = document.querySelector(".store-list");
        this.cartElem = document.querySelector(".cart-list");
        this.cartTotalElem = document.querySelector(".cart-total");

        this.init();
        this.setEvent();   
    }

    async init(){
        
        // #1   JSON 불러오기
        let json = await this.getJSON();

        // #2   스토어 배열 생성하기
        this.storeList = json.map(prod => new Product(this, prod));

        this.storeRender();
        this.cartRender();     
    }

    storeRender(){
        this.storeElem.innerHTML = "";
        this.storeList.forEach(product => {
            this.storeElem.append(product.storeElem);
        });
    }

    cartRender(){
        let total = this.cartList.reduce((p, c) => p + c.initial_data.price * c.buyCount, 0);

        this.cartElem.innerHTML = "";
        this.cartList.forEach(product => {
            this.cartElem.append(product.cartElem);
        });

        this.cartTotalElem.innerText = total.toLocaleString();
    }

    getJSON(){
        return fetch("/json/store.json")
            .then(res => res.json());
    }

    createElem(contents){
        let div = document.createElement("div");
        div.innerHTML = contents;
        return div.firstChild;
    }
}