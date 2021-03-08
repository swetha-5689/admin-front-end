import { FhirDataQueryConsumer } from "@commure/components-data";
import React from "react";
import { useEffect, useState } from "react";

const PractitionerService = (props: FhirDataQueryConsumer) => {
  const { query } = props;
  const [values, setValues] = useState(undefined);
  useEffect(() => {
    query("Practitioner")
      .then((response: Response) => response.clone().json())
      .then((data) => setValues(data));
  }, [query]);
  return values;
};

export default PractitionerService;
