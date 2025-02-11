import React, { useEffect, useState } from "react";
import { StepProps } from "@/types/formTypes";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/app/i18n/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FetchedCookieData } from "@/types/dataTypes";

interface PersonalInfoProps extends StepProps {
  lng: string;
}

export default function PersonalInfo({
  formData,
  setFormData,
  lng,
}: PersonalInfoProps) {
  const { t } = useTranslation(lng, "make-appointment");
  const [cookieData, setCookieData] = useState<FetchedCookieData>({});

  useEffect(() => {
    async function fetchCookies() {
      const response = await fetch("/api/cookie-data");

      if (!response.ok) {
        throw new Error("Failed to get department list from server");
      }

      const cookies = await response.json();
      console.log(cookies);

      setCookieData(cookies);
    }
    fetchCookies();
  }, []);

  const handleUsePrevData = (useCookie: boolean) => {
    if (useCookie) {
      setFormData({
        ...formData,
        name: cookieData.name || "",
        hn: cookieData.hn || "",
        phone: cookieData.phone || "",
        email: cookieData.email || "",
      });
    } else {
      setFormData({ ...formData, name: "", hn: "", phone: "", email: "" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t("patient-information")}</h2>
      <div className="flex border-t-2 border-gray-400 rounded" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="prev-data" onCheckedChange={handleUsePrevData} />
          <Label htmlFor="prev-data">Use previous data?</Label>
        </div>
        <div>
          <p className="mb-1 font-semibold">
            {t("name")} <span className="text-red-500">*</span>
          </p>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <p className="mb-1 font-semibold">{t("hn")}</p>
          <Input
            type="text"
            value={formData.hn}
            onChange={(e) => setFormData({ ...formData, hn: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        {/* <div>
          <p className="mb-1 font-semibold">{t("date-of-birth")}</p>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div> */}

        {/* <div>
          <p className="mb-1 font-semibold">{t("height")}</p>
          <Input
            type="number"
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div> */}

        {/* <div>
          <p className="mb-1 font-semibold">{t("weight")}</p>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div> */}

        {/* <div>
          <p className="mb-1 font-semibold">{t("email")}</p>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div> */}

        <div>
          <p className="mb-1 font-semibold">
            {t("phone")} <span className="text-red-500">*</span>
          </p>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* <div>
          <p className="mb-1 font-semibold">{t("chronic-disease")}</p>
          <Input
            type="text"
            value={formData.chronicDiseases}
            onChange={(e) =>
              setFormData({ ...formData, chronicDiseases: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div> */}

        {/* <div>
          <p className="mb-1 font-semibold">{t("allergy")}</p>
          <Input
            type="text"
            value={formData.allergies}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div> */}
      </div>
    </div>
  );
}
