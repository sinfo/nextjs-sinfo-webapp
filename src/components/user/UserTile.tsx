import ListCard from "@/components/ListCard";

interface UserTileProps {
  user: User;
}

export function UserTile({ user }: UserTileProps) {
  return (
    <ListCard
      title={user.name}
      subtitle={user.title}
      img={user.img}
      imgAltText={`${user.name} picture`}
      link={`/users/${user.id}`}
    />
  );
}
