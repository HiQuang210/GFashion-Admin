const VariantDetails = ({ variants }: { variants: any[] }) => {
  return (
    <div className="p-3 border rounded-md bg-base-200 dark:bg-neutral-800 text-sm mt-2">
      {variants.map((variant) => (
        <div key={variant._id} className="mb-3">
          <p className="font-semibold">Color: {variant.color}</p>
          <div className="pl-4">
            {variant.sizes.map((size: any) => (
              <div key={size._id}>
                Size: <strong>{size.size}</strong> - Stock: <strong>{size.stock}</strong>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantDetails;
