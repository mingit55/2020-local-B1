class PurchaseList {
    constructor(cartList){
        // #1 캔버스 그리기 준비
        this.canvas = document.createElement("canvas");
        this.canvas.width = 450;
        this.canvas.height = 150;
        
        this.padding = 20;
        this.titleSize = 20;
        this.textSize = 16;
        this.textGap = 16;
        
        this.ctx = this.canvas.getContext("2d");
        this.pointer = this.padding + this.titleSize + this.textGap * 3;
        this.drawList = [];


        // #2 장바구니 정보를 그릴 좌표 저장
        cartList.forEach(product => {
            this.styleText();
            this.setText(
                product.initial_data.product_name, 
                product.initial_data.price.toLocaleString() + " 원 × " + product.buyCount + " 개"
            );
        });
            
        this.styleText();
        this.setText("구매일시", this.getDateTime());

        let totalprice = cartList.reduce((p, c) => p + c.initial_data.price * c.buyCount, 0);
        this.styleTitle();
        this.setText("총 합계", totalprice.toLocaleString() + " 원");
    }

    // # 타이틀 스타일로 변경
    styleTitle(){
        this.ctx.fillStyle = "#ea2a2a";
        this.ctx.font = `${this.titleSize}px bold 나눔스퀘어, sans-serif`;
    }
    // # 라벨 스타일로 변경
    styleLabel(){
        this.ctx.fillStyle = "#222";
        this.ctx.font = `${this.textSize}px bold 나눔스퀘어, sans-serif`;
    }
    // # 텍스트 스타일로 변경
    styleText(){
        this.ctx.fillStyle = "#888";
        this.ctx.font = `${this.textSize}px 나눔스퀘어, sans-serif`;
    }

    // # <(라벨)          (텍스트)> 형식이 되도록 좌표 저장 & 공간 부족시 캔버스 확장
    setText(label, text){
        let mt = this.ctx.measureText(text);

        let x1 = this.padding;
        let x2 = this.canvas.width - this.padding - mt.width;
        let y = this.pointer + this.textSize;

        this.drawList.push({label, text, x1, x2, y});

        this.pointer += this.textSize + this.textGap;
        if(this.pointer > this.canvas.height - this.padding){
            this.canvas.height += this.textSize + this.textGap;
        }
    };

    // # 현재 시간 가져오기
    getDateTime(){
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // # 이미지로 출력
    getImage(){
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.styleTitle();
        this.ctx.fillText("구매 내역", this.padding, this.padding + this.titleSize);
        this.drawList.forEach(({label, text, x1, x2, y}, idx) => {
            this.styleLabel();
            this.ctx.fillText(label, x1, y);

            if(idx == this.drawList.length - 1) this.styleTitle();
            else  this.styleText();
            this.ctx.fillText(text, x2, y);
            
        });

        return this.canvas.toDataURL("image/jpeg");
    }
}