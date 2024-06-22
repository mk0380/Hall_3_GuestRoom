"use client";

import { Button, TextField } from "@mui/material";
import { useContext, useEffect } from "react";
import { FormDetails } from "@/context/FormContext";
import FormBox from "./formBox";

const VisitorDetails = ({ tabChange, tab }) => {
  const { form, setForm } = useContext(FormDetails);

  const changeHandler = (ev) => {
    let updatedNames = [...form.visitor_details.name],
      updatedPhones = [...form.visitor_details.phone],
      updatedRelationship = [...form.visitor_details.relationship];

    const { value, id, name } = ev.target;
    const index = parseInt(id);

    setForm((prevForm) => {
      if (name === "name") {
        updatedNames = [...prevForm.visitor_details.name];
        updatedNames[index] = value;
      } else if (name === "phone") {
        updatedPhones = [...prevForm.visitor_details.phone];
        updatedPhones[index] = value;
      } else if (name === "relationship") {
        updatedRelationship = [...prevForm.visitor_details.relationship];
        updatedRelationship[index] = value;
      }

      return {
        ...prevForm,
        visitor_details: {
          ...prevForm.visitor_details,
          name: updatedNames,
          phone: updatedPhones,
          relationship: updatedRelationship,
          purpose: name === "purpose" ? value : form.visitor_details.purpose,
        },
      };
    });
  };

  useEffect(() => {}, [form]);

  const validateField = (field, value) => {
    if (field === "phone") {
      return value.trim().length === 10;
    }
    return value.trim().length > 0;
  };

  const checkVisitorField = (name, indx = undefined) => {
    const detailsArray = form?.visitor_details?.[name];

    if (indx === undefined) {
      const data = detailsArray ?? "";
      return validateField(name, data);
    }

    const value = detailsArray[indx] ?? "";
    return validateField(name, value);
  };

  const isFormValid = () => {
    const no_of_persons = parseInt(form?.room_details?.no_of_persons) || 0;

    if (!checkVisitorField("purpose")) {
      return false;
    }

    for (let i = 0; i < no_of_persons; i++) {
      if (
        !checkVisitorField("name", i) ||
        !checkVisitorField("phone", i) ||
        !checkVisitorField("relationship", i)
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className={"" + (tab === "1" || tab === "3" ? "hidden" : "")}>
      <FormBox widthTop={"30ch"}>
        {[...Array(parseInt(form?.room_details?.no_of_persons || 1))]?.map(
          (_, indx) => (
            <TextField
              key={indx}
              required
              id={indx}
              name="name"
              type="text"
              label={`Person ${indx + 1} Name`}
              value={form?.visitor_details?.name[indx] ?? ""}
              onChange={changeHandler}
              error={!checkVisitorField("name", indx) ?? true}
            />
          )
        )}
      </FormBox>

      <FormBox widthTop={"30ch"}>
        {[...Array(parseInt(form?.room_details?.no_of_persons || 1))]?.map(
          (_, indx) => (
            <TextField
              key={indx}
              required
              id={indx}
              name="phone"
              type="number"
              label={`Phone: Person ${indx + 1}`}
              value={form?.visitor_details?.phone[indx] ?? ""}
              onChange={changeHandler}
              error={!checkVisitorField("phone", indx) ?? true}
            />
          )
        )}
      </FormBox>

      <FormBox widthTop={"30ch"}>
        <TextField
          label="Purpose of Visit"
          type="text"
          name="purpose"
          required
          value={form?.visitor_details?.purpose ?? ""}
          onChange={changeHandler}
          error={!checkVisitorField("purpose", undefined) ?? true}
        />
      </FormBox>

      <FormBox widthTop={"30ch"}>
        {[...Array(parseInt(form?.room_details?.no_of_persons || 1))]?.map(
          (_, indx) => (
            <TextField
              key={indx}
              required
              name="relationship"
              id={indx}
              type="text"
              label={`Relationship of Person ${indx + 1} with Indentor`}
              value={form?.visitor_details?.relationship[indx] ?? ""}
              onChange={changeHandler}
              error={!checkVisitorField("relationship", indx) ?? true}
            />
          )
        )}
      </FormBox>

      <FormBox>
        <Button
          variant="outlined"
          style={{ marginRight: "1rem" }}
          className="btns"
          onClick={(_) => tabChange("1")}
        >
          Prev
        </Button>
        <Button
          variant="outlined"
          disabled={!isFormValid() ?? true}
          className="btns"
          onClick={(_) => tabChange("3")}
        >
          Next
        </Button>
      </FormBox>
    </div>
  );
};

export default VisitorDetails;
