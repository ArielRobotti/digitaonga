import { Radio } from "@mui/material";

const ActionCard = ({
  title,
  subtitle,
  description,
  Icon,
  handleRadioChange,
  selectedValue,
  className,
}) => (
  <article
    key={title}
    className={`grid gap-2 p-4 cursor-pointer rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)] md:max-w-[340px] ${className}`}
    style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15)" }}
    onClick={() => handleRadioChange({ target: { value: title } })}
  >
    <section className="flex items-center gap-1">
      <Radio
        checked={selectedValue === title}
        onChange={handleRadioChange}
        value={title}
        name="radio-buttons"
        inputProps={{ "aria-label": title }}
        size="small"
      />
      <p className="font-bold">{title}</p>
    </section>
    <section className="flex items-center gap-2">
      {<Icon />}
      <p>{subtitle}</p>
    </section>
    <p>{description}</p>
  </article>
);

export default ActionCard;
