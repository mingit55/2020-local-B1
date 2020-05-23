class App {
    cartList = [];

    constructor(){
        // #0   자주 사용하는 DOM 저장하기
        this.storeElem = document.querySelector(".store-list");
        this.cartElem = document.querySelector(".cart-list");
        this.cartTotalElem = document.querySelector(".cart-total");
        this.dropElem = document.querySelector(".drag-box");

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

        this.cartElem.innerHTML = `<div class="cart-head d-flex text-center text-muted border-bottom py-3">
                                        <div class="image">이미지</div>
                                        <div class="info text-center">상품 정보</div>
                                        <div class="price">가격</div>
                                        <div class="count">구매 개수</div>
                                        <div class="total">총합</div>
                                    </div>`;
        if(this.cartList.length > 0) {
            this.cartList.forEach(product => {
                this.cartElem.append(product.cartElem);
            });
        } else {
            this.cartElem.append(this.createElem("<p class='text-center py-4 text-muted'>장바구니에 담긴 상품이 없습니다<p>"));
        }
        

        this.cartTotalElem.innerText = total.toLocaleString();
    }

    setEvent(){
        // # 스토어 영역
        let dragTarget, startPoint;
        $(window).on("mousemove", e => {
            if(e.which === 1 && dragTarget) {
                let x = e.pageX - startPoint[0];
                let y = e.pageY - startPoint[1];
                dragTarget.style.transform = `translate(${x}px, ${y}px)`;
            }
        });

        $(window).on("mouseup", e => {
            if(e.which !== 1 || !dragTarget) return false;

            let target = dragTarget;
            target.classList.remove("active");
            target.style.transform = "translate(0, 0)";
            dragTarget = startPoint = null;


            let {left, top} = $(this.dropElem).offset();
            let width = $(this.dropElem).width();
            let height = $(this.dropElem).height();

            if(left < e.pageX && e.pageX < left + width && top < e.pageY && e.pageY < top + height){
                // # 상품 이미지가 드롭 영역 안에 떨궈짐
                
                let id = target.dataset.id;
                let product = this.storeList.find(product => product.id == id);
                if( this.cartList.some(cartItem => cartItem == product) ) {
                    alert("이미 장바구니에 담긴 상품입니다.");
                } else {
                    product.buyCount++;
                    product.cartRender();
                    this.cartList.push(product);
                    this.cartRender();
                }
            }
        });

        $(this.storeElem).on("dragstart", ".store-item .image", e => {
            e.preventDefault();
            dragTarget = e.currentTarget;
            dragTarget.classList.add("active");
            startPoint = [e.pageX, e.pageY];
        });


        // # 장바구니 영역
        $(this.cartElem).on("input", ".c-count", e => {
            let id = e.target.dataset.id;
            let value = e.target.value ? e.target.value : 1;
            let product = this.cartList.find(cartItem => cartItem.id == id);
            product.buyCount = parseInt(value);
            product.cartRender();
            this.cartRender();
            e.target.focus();
        }); 

        $(this.cartElem).on("click", ".remove button", e => {
            let id = e.currentTarget.dataset.id;
            let idx = this.cartList.findIndex(cartItem => cartItem.id == id);
            if(idx >= 0){
                let cart = this.cartList[idx];
                cart.buyCount = 0;
                cart.cartRender();
                this.cartList.splice(idx, 1);
                this.cartRender();
            }
        });

        $("#buy-modal form").on("submit", e => {
            e.preventDefault();
            
            // #1 영수증 출력
            let purchaseList = new PurchaseList(this.cartList);
            let outputURL = purchaseList.getImage();

            // #2 장바구니를 비운다
            this.cartList.forEach(cartItem => {
                cartItem.buyCount = 0;
                cartItem.cartRender();
            });
            this.cartList = [];
            this.cartRender();
            
        

            $("#buy-modal").modal("hide");
            $("#purchase-modal img").attr("src", outputURL);
            $("#purchase-modal").modal("show");
        });

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