import Image from "next/image";

import check from "@/assets/icons/check-in.png";
import happy from "@/assets/icons/happy.png";
import unhappy from "@/assets/icons/unhappy.png";

export default function ActionCard(
    {action="", role="Undefined", bool=false}
    : {action?: string, role?:string, bool?: Boolean}) {
    let background = "bg-greenAC"
    let image = check
    let imageAlt = "Check"
    let text = ""
    let b1Text = ""
    let b1 = false

    switch (action) {
        case "promotion":
            text = `Promoted to ${role} successfully!`
            break;
        case "checkIn":
            text = "Checked-In successfully"
            break;
        case "achievement":
            text = "Secret Achievement added successfully!"
            b1 = true
            b1Text = "Go to Achievements"
            break;
        case "validateCard":
            if(bool) {
                image = happy
                text = "Great! Spin the wheel of fortune!"
            } else {
                image = unhappy
                text = "Oops... Not this time!"
                background = "bg-red";
            }
            break;
        case "workshop":
            text = `Workshop ${bool ? "" : "dis"}enrollment successfull!`
            b1 = true
            b1Text = "Your Enrollments"
            break;
        case "linkCard":
            text = "Card Linked successfully!"
            b1 = true
            b1Text = "My Links"
            break;
        default:
            return (<div className="bg-[#FF0000]">Wrong input for action field in ActionCard component</div>);
    }

    return(
        <div className={`absolute flex flex-col items-center min-w-auto min-h-auto ${background} rounded-md mx-12 top-[20%]`}>
            <Image className=" m-4 mb-0 relative" src={image} alt={imageAlt} />
            <div className="actionCardMessage m-6">{text}</div>
            {b1 ? <button className="font-bold text-sm leading-tight w-40 h-8 bg-dark-blue rounded-md m-4 mb-2 mt-0">
                {b1Text}
            </button> : null}
            <button className={`font-bold text-sm w-40 h-8 ${b1 ? "bg-white text-dark-blue border-2 border-dark-blue" : "bg-dark-blue"} rounded-md m-6 mt-0 leading-tight`}>
                Go Back
            </button>
        </div>
    )
}