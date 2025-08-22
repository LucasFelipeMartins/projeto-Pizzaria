const c = (el)=>document.querySelector(el);
const cl = (el)=>document.querySelectorAll(el);

let pizzaQuant = 1;
let precoTotal;
let modalkey = 0;
let carrinho = [];

pizzaJson.map((item, index) => {

    let pizzaItem = c('.pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {

        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        pizzaQuant = 1;
        
        modalkey = key;

        c('.pizzaBig').innerHTML = `<img src="${pizzaJson[key].img}"/>`;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        c('.pizzaInfo--qt').innerHTML = pizzaQuant;
        cl('.pizzaInfo--size').forEach((element, elementindex) => {

            if(elementindex == 2){

                c('.selected').classList.remove('selected');
                element.classList.add('selected');

            }

            element.querySelector('span').innerHTML = pizzaJson[key].sizes[elementindex];

        });
        
        c('.pizzaInfo--cancelButton').addEventListener('click', fecharModal);

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{

            c('.pizzaWindowArea').style.opacity = 1;

        }, 200);

    })

    c('.pizza-area').append(pizzaItem);

})


function fecharModal(){

        c('.pizzaWindowArea').style.opacity = 0;

        setTimeout(() => {

            c('.pizzaWindowArea').style.display = 'none';

        }, 300);

}

c('.pizzaInfo--qtmenos').addEventListener('click', () => {

    if(pizzaQuant != 1){
                
        pizzaQuant--;
        c('.pizzaInfo--qt').innerHTML = `${pizzaQuant}`;

    }    

    precoTotal = pizzaJson[modalkey].price*pizzaQuant;

    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${precoTotal.toFixed(2)}`

});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
            
    pizzaQuant++;
    c('.pizzaInfo--qt').innerHTML = `${pizzaQuant}`;

    precoTotal = pizzaJson[modalkey].price*pizzaQuant;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${precoTotal.toFixed(2)}`
            
});

cl('.pizzaInfo--size').forEach(size => {

            size.addEventListener('click', () => {

                c('.selected').classList.remove('selected');                
                size.classList.add('selected');

            });

        })

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let tamanho = parseInt(c('.selected').getAttribute('data-key'));

    let identificador =  pizzaJson[modalkey].id + '$' + tamanho;

    let cod = carrinho.findIndex((item) => item.identificador == identificador);
    
    if(cod > -1){

        carrinho[cod].quantidade = carrinho[cod].quantidade + pizzaQuant;
    }

    else{

        carrinho.push({
            
            identificador,
            id: pizzaJson[modalkey].id,
            size: tamanho,
            quantidade: pizzaQuant
            
        })
        
    }

    fecharModal();
    updateCar();

})

function updateCar(){

    if(carrinho.length > 0){

        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in carrinho){

            let pizzas = pizzaJson.find((item) => {

                return item.id == carrinho[i].id;

            }) 

            subTotal = subTotal + (pizzas.price * carrinho[i].quantidade);

            let cartItem = c('.cart--item').cloneNode(true);

            let pizzaSize;

            switch(carrinho[i].size) {
                case 0:
                    pizzaSize = 'P';
                    break;
                case 1:
                    pizzaSize = 'M';
                    break;
                case 2:
                    pizzaSize = 'G';
                    break;
                default:
                    pizzaSize = '';
                    break;
            }

            let pizzasName = `${pizzas.name} (${pizzaSize})`;

            cartItem.querySelector('img').src = pizzas.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzasName;
            cartItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].quantidade;
            
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
            
                if(carrinho[i].quantidade > 1){

                    carrinho[i].quantidade = carrinho[i].quantidade - 1;

                }else{

                    carrinho.splice(i , 1);
                    
                }

                updateCar();

            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
            
                carrinho[i].quantidade = carrinho[i].quantidade + 1;
                updateCar();

            });

            c('.cart').append(cartItem);

        }
        
        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        c('.subtotal span:last-child').innerHTML = `${subTotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `${total.toFixed(2)}`;
        
    }else{

        c('aside').classList.remove('show');

    }

}