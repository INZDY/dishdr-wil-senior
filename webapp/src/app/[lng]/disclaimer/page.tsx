"use client";

import { useTranslation } from "@/app/i18n/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Disclaimer({ params }: { params: any }) {
  const { lng } = React.use<{ lng: string }>(params);
  const { t } = useTranslation(lng, "activity");
  const router = useRouter();
  const session = useSession();

  // if (loading) {
  //   return (
  //     <p className="flex justify-center font-lg text-bold text-white">
  //       Loading...
  //     </p>
  //   );
  // }

  if (!session) {
    router.push("/");
  }
  return (
    <div className="flex flex-col max-w-screen-lg mx-auto my-2 p-4 gap-6 text-white">
      <h1 className="text-3xl font-bold">Disclaimer</h1>
      <p>
        This web application, Dishdr, is a web application for appointment
        management with the hospital, where patients can make appointments,
        track their status and see information related to the appointment. And
        staff can manage patients’ appointments, including appointment statuses,
        date, time, and assigned department.
      </p>
      <p>
        The web application incorporates a machine learning system to help
        analyze patient symptoms during the inquiry process in order to
        determine appropriate departments for the symptoms they have.
      </p>
      <h2 className="text-2xl font-semibold">Machine Learning Model Used</h2>
      <p>
        As project progress, we have developed 3 machine learning models to help
        in the inquiry and department prediction step.
      </p>
      <ul className="list-disc list-inside">
        <li>Recurrent neural network model : LSTM</li>
        <li>Embedded-based deep learning model</li>
        <li>Decision tree-based model : XGBoost</li>
      </ul>
      <p>
        XGBoost showed best performance on predicting the department with 99%
        accuracy and was chosen to be our main model for the application.
      </p>
      <h2 className="text-2xl font-semibold">Dataset Source</h2>
      <p>
        Data used to train models in our project comes from an online source,
        named DDXplus. It is a large-scale dataset provided for the diagnosis
        system in the medical domain. With our limitation on time schedule, we
        have filtered and gathered only some of binary features related to our
        use case from this dataset. There are 145 unique input features in the
        form of inquiry questions and 29 possible output pathologies.
      </p>
      <p>
        <span>Data Source: </span>
        <a href="https://github.com/mila-iqia/ddxplus" className="underline hover:text-neutral-200">DDXPlus</a>
      </p>
    </div>
  );
}
