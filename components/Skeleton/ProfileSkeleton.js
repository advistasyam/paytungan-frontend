import "twin.macro"

const ProfileSkeleton = () => {
  return (
    <div tw="animate-pulse flex w-[250px] h-[20px]">
      <div tw="h-full w-full bg-gray-200 rounded-xl" />
    </div>
  )
}

export { ProfileSkeleton }
