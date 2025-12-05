import Button from "./Button";

const CardItem = ({ item }) => {
    return (
        <div className="p-4 border rounded-xl shadow-sm">
            <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg"
            />

            <h3 className="mt-2 font-semibold">{item.name}</h3>

            <p className="text-sm opacity-70">
                {item.description}
            </p>

            <p className="mt-1 font-bold">${item.price}</p>

            {/* Truyền sản phẩm vào button */}
            <Button product={item} />
        </div>
    );
};

export default CardItem;
