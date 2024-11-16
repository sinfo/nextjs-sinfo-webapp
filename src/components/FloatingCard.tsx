import Link from "next/link";
import { Image } from "next/dist/client/image-component";

const topName = (name: string) => {
  return (<p className="text-black text-xs">{name}</p>)
}

const sessionInfo = (sesh: Session) => {
  const date = new Date(sesh.date)
  const duration = new Date(sesh.duration)

  const rep = sesh.kind == "KEYNOTE" ? sesh.speakers : sesh.companies

  return (
    <div>
      <div className="flex flex-row items-center justify-start space-x-2">
        <p className="text-gray-500 text-xs">--:-- - --:--</p>
        <p className="text-gray-500 text-[8px]">({sesh.kind})</p>
      </div>
      <p className="text-black text-xs">{sesh.name}</p>
      <p className="text-black text-[8px]">{rep.map((k)=>k.name).join(' | ')}</p>
    </div>
    
  )
}

const person = (person: User | Speaker) => {
  return (
  <div>
    <p className="text-black text-[14px]">{person.name}</p>
    <p className="text-black text-[8px]">{'title' in person ? person.title : ""}</p>
  </div>
  )
}

const compImg = (speaker: any) => {
  return (
    <Image
          src={speaker.img}  //TODO: Change to speaker.companyImg when cannon is updated
          alt="Company"
          width={100}
          height={100}
          className="h-full w-auto object-contain"
        />
  )
}

const nothing = (any: any) => {return (null)}

const cards = {
  session: {
    cardShape: "w-[88vw] h-[7vh] flex-row justify-start px-[2%] py-[1%] space-x-2",
    imageShape: "h-full w-auto",
    name: nothing,
    info: sessionInfo,
    img: nothing,
  },
  company: {
    cardShape: "w-[41vw] h-[20vh] flex-col justify-center p-[5%]",
    imageShape: "w-full",
    name: topName,
    info: nothing,
    img: nothing,
  },
  employee: {
    cardShape: "w-[88vw] h-[7vh] flex-row justify-start px-[2%] py-[1%] space-x-2",
    imageShape: "h-full w-auto rounded-full",
    name: nothing,
    info: person,
    img: nothing,
  },
  speaker: {
    cardShape: "w-[88vw] h-[7vh] flex-row justify-start px-[2%] py-[1%] space-x-2",
    imageShape: "h-full w-auto",
    name: nothing,
    info: person,
    img: compImg,
  },
  simple_speaker: {
    cardShape: "w-[41vw] h-[20vh] flex-col justify-center p-[5%]",
    imageShape: "w-full",
    name: topName,
    info: nothing,
    img: nothing,
  }
}

type cardType = keyof typeof cards;

interface FloatingCardProps {
  data: Company | Speaker | Session | User;
  type: cardType;
}

/**
 * This function creates a floating card component.
 * @param {string} data - The data to show on the card.
 * @param {cardType} type - The type of card.
 * @returns {JSX.Element} The rendered card component.
 */
export default function FloatingCard({data, type}: FloatingCardProps) {
  
  const { cardShape, imageShape, name, info , img} = cards[type]

  return (
      <div className={`bg-white rounded-md shadow-md flex items-center ${cardShape}`}>
        {name(data.name)}
        <Image
          src={data.img}
          alt="Picture"
          width={100}
          height={100}
          className={`object-contain ${imageShape}`}
        />
        <div className="w-full h-full flex flex-row items-center justify-between">
          {info(data)}
          {img(data)}
        </div>
      </div>
  );
}
