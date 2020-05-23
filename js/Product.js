class Product {
    buyCount = 0;

    constructor(app, initial_data){
        this.app = app;

        initial_data.price = parseInt(initial_data.price.replace(/[^0-9]+/, ''));    // 문자열 -> 숫자
        this.initial_data = initial_data;
        
        this.init();
        this.storeRender();
        this.cartRender();
    }

    init(){
        let {id, product_name, photo, brand, price} = this.initial_data;
        this.id = id;
        this.name = product_name;
        this.photo = photo;
        this.brand = brand;
        this.price = price;
    }

    storeRender(){
        if(!this.storeElem){
            this.storeElem = this.app.createElem(`<div class="col-lg-4 col-md-6 col-12 mb-5">
                                                    <div class="store-item" draggable="draggable">
                                                        <div>
                                                            <div class="image" data-id=${this.id}>
                                                                <img src="images/products/${this.photo}" title="상품 이미지" alt="상품 이미지">
                                                            </div>
                                                            <div class="p-3 d-flex justify-content-between align-items-end">
                                                                <div>
                                                                    <div class="p-name fx-n3 text-muted">${this.name}</div>
                                                                    <div class="p-brand mt-1 fx-3">${this.brand}</div>
                                                                </div>
                                                                <div>
                                                                    <div>
                                                                        <span class="p-price fx-5 text-red">${this.price.toLocaleString()}</span>
                                                                        <span class="ml-1">원</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`);
        } else {
            this.storeElem.querySelector(".p-name").innerHTML = this.name;
            this.storeElem.querySelector(".p-brand").innerHTML = this.brand;
            this.storeElem.querySelector(".p-price").innerHTML = this.price.toLocaleString();
        }
    }

    cartRender(){
        let {photo, product_name, brand, price} = this.initial_data;

        if(!this.cartElem) {
            this.cartElem = this.app.createElem(`<div class="cart-item">
                                                    <div class="image">
                                                        <img src="images/products/${photo}" title="상품 이미지" alt="상품 이미지">
                                                    </div>
                                                    <div class="info">
                                                        <div class="px-5 w-100">
                                                            <div class="fx-2">${product_name}</div>
                                                            <div class="mt-1 fx-n2 text-muted">${brand}</div>
                                                        </div>
                                                    </div>
                                                    <div class="price">
                                                        <div class="text-center">
                                                            <span class="text-muted"><span class="c-price">${price.toLocaleString()}</span> 원</span>
                                                        </div>
                                                    </div>
                                                    <div class="count">
                                                        <div class="text-center">
                                                            <input type="number" class="i-count c-count" min="1" value="${this.buyCount}" data-id="${this.id}">
                                                        </div>
                                                    </div>
                                                    <div class="total">
                                                        <div class="text-center">
                                                            <span class="fx-2 font-weight-bold c-total">${(this.buyCount * price).toLocaleString()}</span>
                                                            원
                                                        </div>
                                                    </div>
                                                    <div class="remove">
                                                        <div class="text-center">
                                                            <button data-id=${this.id}>&times;</button>
                                                        </div>
                                                    </div>
                                                </div>`);
        } else {
            this.cartElem.querySelector(".c-price").innerText = price.toLocaleString();
            this.cartElem.querySelector(".c-count").value = this.buyCount;
            this.cartElem.querySelector(".c-total").innerText = (this.buyCount * price).toLocaleString();
        }
    }
}