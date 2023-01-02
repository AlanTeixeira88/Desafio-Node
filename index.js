const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();
app.use(express.json());

const orderList = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orderList.findIndex(newOrder => newOrder.id === id)
    if (index < 0) {
        return response.status(404).json({message: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
};

const checkUrl = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(`This request is using the ${method} method and the url ${url}`)

    next()
};

app.post("/order", checkUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orderList.push(newOrder)

    return response.status(201).json(newOrder)
});

app.get("/order", checkUrl, (request, response) => {
    return response.json(orderList)
});

app.put("/order/:id", checkUrl, checkOrderId, (request, response) => {
    const id = request.orderId
    const { order, clientName, price } = request.body
    const updateOrder = { id, order, clientName, price, status: "Em preparação" }
    const index = request.orderIndex

    orderList[index] = updateOrder

    return response.json(updateOrder)
});

app.delete("/order/:id", checkUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex

    orderList.splice(index, 1)

    return response.status(204).json()
})

app.get("/order/:id", checkUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex

    const order = orderList[index]

    return response.json(order)
});

app.patch("/order/:id", checkUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex

    const order = orderList[index]
    order.status = "Pronto"

    return response.json(order)
});


app.listen(port, () => {
    console.log(`🚀 sever started on port ${port}`)
});
