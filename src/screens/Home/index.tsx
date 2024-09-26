"use client";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RenderFormField from "@/components/RenderFormField";
import { IFormField } from "@/interfaces/FormField.interface";
import { envConfig } from "@/config/envConfig";
import { useContext, useState } from "react";
import zoomContext from "@/context/zoom-context";
import { generateVideoToken } from "@/shared/utils";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "@/components/FullScreenLoader";
import { ILoading } from "@/interfaces/common.interface";

const formSchema = z.object({
  sessionName: z.string(),
  name: z.string(),
  password: z.string(),
  role: z.string(),
});

const Home = () => {
  const navigate = useNavigate();
  const zmClient = useContext(zoomContext);
  const [loading, setLoading] = useState<ILoading>({ isLoading: false });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionName: envConfig.topic,
      name: "",
      password: envConfig.password,
      role: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading({ message: "Joining", isLoading: true });
    const signature = generateVideoToken(
      envConfig.sdkKey,
      envConfig.sdkSecret,
      data.sessionName
    );
    await zmClient.join(data.sessionName, signature, data.name, data.password);
    setLoading({ isLoading: false });
    navigate("/preview-stream");
  }

  const fields: IFormField[] = [
    {
      inputType: "input",
      name: "sessionName",
      label: "Session Name",
      placeholder: "Enter session name",
      control: form.control,
    },
    {
      inputType: "input",
      name: "name",
      label: "Name",
      placeholder: "Enter name",
      control: form.control,
    },
    {
      inputType: "input",
      name: "password",
      label: "Password",
      placeholder: "Enter name",
      control: form.control,
    },
    {
      inputType: "select",
      name: "role",
      label: "Role",
      placeholder: "Select Role",
      control: form.control,
      options: [
        {
          label: "Host",
          value: "1",
        },
        {
          label: "User",
          value: "0",
        },
      ],
    },
  ];

  return loading.isLoading ? (
    <FullScreenLoader message={loading.message} />
  ) : (
    <div className="flex items-center justify-center w-full h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="text-center">Join Meeting</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {fields.map((field) => (
                <RenderFormField key={field.name} {...field} />
              ))}
            </CardContent>
            <CardFooter className="flex w-full justify-end">
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Home;
