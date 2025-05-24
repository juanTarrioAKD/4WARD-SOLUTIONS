import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  image: string;
  price: number;
}

const CategoryCard = ({ name, image, price }: CategoryCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-lg font-bold text-blue-600">${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CategoryCard; 