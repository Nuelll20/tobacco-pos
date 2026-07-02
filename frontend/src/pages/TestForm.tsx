import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof schema>;

export default function TestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Submit berhasil");
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Masukkan nama"
          className="border p-2"
        />

        {errors.name && (
          <p style={{ color: "red" }}>
            {errors.name.message}
          </p>
        )}

        <button
          type="submit"
          className="border px-4 py-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}