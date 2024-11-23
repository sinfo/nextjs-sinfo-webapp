import { Image } from "next/dist/client/image-component";

const topName = (name: string) => {
  return (<p className="text-black text-xs text-center">{name}</p>)
}

const compImage = (img: string) => {
  return (
    <Image
          src={img}
          alt="Company"
          width={100}
          height={100}
          className="h-full w-auto object-contain"
        />
  )
}

interface FloatingCardProps {
  topText?: string;
  img: string;
  time?: string;
  type?: string;
  text?: string;
  subtext?: string;
  compImg?: string;
  shape: "square" | "long"
}

const shapes = {
  square: {
    cardShape: "w-[41vw] h-[20vh] flex-col justify-center p-[5%]",
    imageShape: "w-full",
  },
  long: {
    cardShape: "w-[88vw] h-[7vh] flex-row justify-start px-[2%] py-[1%] space-x-2",
    imageShape: "h-full w-auto rounded-full",
  }
}


/**
 * This function creates a floating card component.
 * @param {string} data - The data to show on the card.
 * @param {cardType} type - The type of card.
 * @returns {JSX.Element} The rendered card component.
 */
export default function FloatingCard(
  {topText , img = "", time = "", type = "", text = "", subtext = "", compImg, shape}: FloatingCardProps
) {

  const { cardShape, imageShape } = shapes[shape]
  
  return (
      <div className={`bg-white rounded-md shadow-md flex items-center ${cardShape}`}>
        {topText == undefined ? null : topName(topText)}
        <Image
          src={img}
          alt="Picture"
          width={100}
          height={100}
          className={`object-contain ${imageShape}`}
        />
        <div className="w-full h-full flex flex-row items-center justify-between">
          <div>
            <div className="flex flex-row items-center justify-start space-x-2">
              <p className="text-gray-500 text-xs">{time}</p>
              <p className="text-gray-500 text-[8px]">{type}</p>
            </div>
            <p className="text-black text-xs">{text}</p>
            <p className="text-black text-[8px]">{subtext}</p>
          </div>
          { compImg == undefined ? null : compImage(compImg)}
        </div>
      </div>
  );
}
