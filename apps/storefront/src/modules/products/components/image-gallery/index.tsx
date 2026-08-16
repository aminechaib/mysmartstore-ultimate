// File: apps/storefront/src/modules/products/components/image-gallery/index.tsx

import { HttpTypes } from "@medusajs/types"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images?.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-6">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm"
          id={image.id}
        >
          <img
            src={image.url}
            alt={`Product image ${index + 1}`}
            className="w-full h-auto object-cover object-center"
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGallery
