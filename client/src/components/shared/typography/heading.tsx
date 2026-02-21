export const Heading = ({ title }: { title: string }) => {
  return (
    <h1 className="text-3xl text-secondary-foreground dark:text-secondary font-semibold font-newsreader">
      {title}
    </h1>
  );
};
