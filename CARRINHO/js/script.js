const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
let modalQt = 0;
let car = [];
let key = 0;

modelsJson.map((item, index) => {
    let modelosItem = c('.modelos .modelos-item ').cloneNode(true);
    modelosItem.setAttribute('data-key', index);
    modelosItem.querySelector('.modelos-item--img img').src = item.img;
    modelosItem.querySelector('.modelos-item--preco').innerHTML = `R$ ${item.price[2].toFixed(2)}`
    modelosItem.querySelector('.modelos-item--nome').innerHTML = item.name;
    modelosItem.querySelector('.modelos-item--desc').innerHTML = item.description;


    modelosItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); /* Não irá fazer a recarga da página */
        key = e.target.closest('.modelos-item').getAttribute('data-key');
        modalQt = 1;
        c('.modelosBig img').src = modelsJson[key].img;
        c('.modelosInfo h1').innerHTML = modelsJson[key].name;
        c('.modelosInfo--desc').innerHTML = modelsJson[key].description;
        //c('.modelosInfo--actualPreco').innerHTML = `R$ ${modelsJson[key].price[2].toFixed(2)}`;
        c('.modelosInfo--size.selected').classList.remove('selected');
        cs('.modelosInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
                c('.modelosInfo--actualPreco').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
            }
            size.innerHTML = modelsJson[key].sizes[sizeIndex];
            //size.querySelector('span'),innerHTML = modelsJson[key].sizes[sizeIndex]; -- Alternativa de amostra de tamanho HTML mais info no JSON
        });
        c('.modelosInfo--qt').innerHTML = modalQt;
        c('.modelosWindowArea').style.opacity = 0;
        c('.modelosWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.modelosWindowArea').style.opacity = 1;
        }, 500);


    });


    c('.modelos-area').append(modelosItem);
});

// Ações de Janela
function fecharmold() {
    c('.modelosWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.modelosWindowArea').style.display = 'none';
    }, 500);
}

cs('.modelosInfo--cancelButton ,.modelosInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', fecharmold);
})

c('.modelosInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.modelosInfo--qt').innerHTML = modalQt
    }
})

c('.modelosInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.modelosInfo--qt').innerHTML = modalQt;

})

cs('.modelosInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.modelosInfo--size.selected').classList.remove('selected');
        e.target.classList.add('selected');
        c('.modelosInfo--actualPreco').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
    })
})
c('.modelosInfo--addButton').addEventListener('click', () => {

    //Modelo
    console.log("Modelo: " + key)
    //Tamanho
    let size = parseInt(c('.modelosInfo--size.selected').getAttribute('data-key'))
    console.log('Tamanho: ' + size)
    //Quantidade
    console.log('Quantidade: ' + modalQt)


    //Identificador
    let iden = modelsJson[key].id + '@' + size;

    let locaId = car.findIndex((item) => item.iden == iden)
    if (locaId > -1) {
        car[locaId].qt += modalQt;
    } else {
        car.push({
            iden,
            id: modelsJson[key].id,
            size,
            qt: modalQt
        });
    }
    atualizarCar();
    fecharmold();
})

c('.menu-aberto').addEventListener('click', () => {
    if (car.length > 0) {
        c('aside').style.left = '0';
    }
})
c('.menu-fechado').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})

c('.cart--finalizar').addEventListener('click', () => {
    car = [];
    atualizarCar()

})

function atualizarCar() {
    c('.menu-aberto span').innerHTML = car.length;
    if (car.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = '';
        let subtotal = 0;
        let total = 0;

        car.map((itemCar, index) => {
            let modelItem = modelsJson.find((itemBD) => itemBD.id == itemCar.id);
            subtotal += modelItem.price[itemCar.size] * itemCar.qt;
            let carItem = c('.modelos .cart--item').cloneNode(true)


            carItem.querySelector('img').src = modelItem.img
            carItem.querySelector('.cart--item-nome').innerHTML = `${modelItem.name} - ${modelItem.sizes[itemCar.size]}`;
            carItem.querySelector('.cart-item-qt').innerHTML = itemCar.qt;
            carItem.querySelector('.cart-item--qtmenos').addEventListener('click', () => {
                if (itemCar.qt > 1) {
                    itemCar.qt--;

                } else {
                    car.splice(index, 1);
                }
                atualizarCar();
            })
            carItem.querySelector('.cart-item--qtmais').addEventListener('click', () => {
                itemCar.qt++;
                atualizarCar();
            })



            c('.cart').append(carItem)
        });
        total = subtotal;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}