import { useState, useCallback } from 'react';import { useState, useCallback } from 'react';

import type { GCSCardProps } from '../lib/schemas/specialized-cards';import type { GCSCardProps } from '../lib/schemas/specialized-cards';

import { TextField, RadioField } from './card-fields';import { TextField, RadioField } from './card-fields';



interface ComponentProps {interface ComponentProps {

  id: string;  id: string;

  time: string;  time: string;

  details: GCSCardProps['details'];  details: GCSCardProps['details'];

  verification: GCSCardProps['verification'];  verification: GCSCardProps['verification'];

  onTimeChange: (time: string) => void;  onTimeChange: (time: string) => void;

  onDetailsChange?: (details: GCSCardProps['details']) => void;  onDetailsChange?: (details: GCSCardProps['details']) => void;

  onVerifiedChange?: (verified: boolean) => void;  onVerifiedChange?: (verified: boolean) => void;

}}



const eyeValues = [const eyeValues = [

  { value: 'None', label: '1 - No eye opening' },  { value: 'None', label: '1 - No eye opening' },

  { value: 'To Pain', label: '2 - To pain' },  { value: 'To Pain', label: '2 - To pain' },

  { value: 'To Voice', label: '3 - To voice' },  { value: 'To Voice', label: '3 - To voice' },

  { value: 'Spontaneous', label: '4 - Spontaneous' }  { value: 'Spontaneous', label: '4 - Spontaneous' }

];];



const verbalValues = [const verbalValues = [

  { value: 'None', label: '1 - No verbal response' },  { value: 'None', label: '1 - No verbal response' },

  { value: 'Incomprehensible', label: '2 - Incomprehensible sounds' },  { value: 'Incomprehensible', label: '2 - Incomprehensible sounds' },

  { value: 'Inappropriate', label: '3 - Inappropriate words' },  { value: 'Inappropriate', label: '3 - Inappropriate words' },

  { value: 'Confused', label: '4 - Confused' },  { value: 'Confused', label: '4 - Confused' },

  { value: 'Oriented', label: '5 - Oriented' }  { value: 'Oriented', label: '5 - Oriented' }

];];



const motorValues = [const motorValues = [

  { value: 'None', label: '1 - No motor response' },  { value: 'None', label: '1 - No motor response' },

  { value: 'Extension', label: '2 - Extension to pain' },  { value: 'Extension', label: '2 - Extension to pain' },

  { value: 'Abnormal Flexion', label: '3 - Abnormal flexion' },  { value: 'Abnormal Flexion', label: '3 - Abnormal flexion' },

  { value: 'Withdraws', label: '4 - Withdraws from pain' },  { value: 'Withdraws', label: '4 - Withdraws from pain' },

  { value: 'Localizes Pain', label: '5 - Localizes pain' },  { value: 'Localizes Pain', label: '5 - Localizes pain' },

  { value: 'Obeys Commands', label: '6 - Obeys commands' }  { value: 'Obeys Commands', label: '6 - Obeys commands' }

];];



const pupilValues = [const pupilValues = [

  { value: 'Normal', label: 'Normal' },  { value: 'Normal', label: 'Normal' },

  { value: 'Constricted', label: 'Constricted' },  { value: 'Constricted', label: 'Constricted' },

  { value: 'Dilated', label: 'Dilated' },  { value: 'Dilated', label: 'Dilated' },

  { value: 'No Response', label: 'No Response' }  { value: 'No Response', label: 'No Response' }

];];



const eyeScore = {const eyeScore = {

  'None': 1,  'None': 1,

  'To Pain': 2,  'To Pain': 2,

  'To Voice': 3,  'To Voice': 3,

  'Spontaneous': 4  'Spontaneous': 4

} as const;} as const;



const verbalScore = {const verbalScore = {

  'None': 1,  'None': 1,

  'Incomprehensible': 2,  'Incomprehensible': 2,

  'Inappropriate': 3,  'Inappropriate': 3,

  'Confused': 4,  'Confused': 4,

  'Oriented': 5  'Oriented': 5

} as const;} as const;



const motorScore = {const motorScore = {

  'None': 1,  'None': 1,

  'Extension': 2,  'Extension': 2,

  'Abnormal Flexion': 3,  'Abnormal Flexion': 3,

  'Withdraws': 4,  'Withdraws': 4,

  'Localizes Pain': 5,  'Localizes Pain': 5,

  'Obeys Commands': 6  'Obeys Commands': 6

} as const;} as const;



export function GCSCardComponent({export function GCSCardComponent({

  id,  id,

  time,  time,

  details,  details,

  verification,  verification,

  onTimeChange,  onTimeChange,

  onDetailsChange,  onDetailsChange,

  onVerifiedChange  onVerifiedChange

}: ComponentProps) {}: ComponentProps) {

  const [values, setValues] = useState(details);  const [values, setValues] = useState(details);



  const handleVerifiedChange = useCallback(() => {  const handleVerifiedChange = useCallback(() => {

    onVerifiedChange?.(!verification.verified);    onVerifiedChange?.(!verification.verified);

  }, [onVerifiedChange, verification.verified]);  }, [onVerifiedChange, verification.verified]);



  const handleChange = useCallback(  const handleChange = useCallback(

    (field: keyof typeof values, value: string) => {    (field: keyof typeof values, value: string) => {

      setValues(prev => {      setValues(prev => {

        const next = { ...prev, [field]: value };        const next = { ...prev, [field]: value };



        if (        if (

          field === 'eyeOpening' ||          field === 'eyeOpening' ||

          field === 'verbalResponse' ||          field === 'verbalResponse' ||

          field === 'motorResponse'          field === 'motorResponse'

        ) {        ) {

          next.totalScore =          next.totalScore =

            eyeScore[next.eyeOpening as keyof typeof eyeScore] +            eyeScore[next.eyeOpening as keyof typeof eyeScore] +

            verbalScore[next.verbalResponse as keyof typeof verbalScore] +            verbalScore[next.verbalResponse as keyof typeof verbalScore] +

            motorScore[next.motorResponse as keyof typeof motorScore];            motorScore[next.motorResponse as keyof typeof motorScore];

        }        }



        onDetailsChange?.(next);        onDetailsChange?.(next);

        return next;        return next;

      });      });

    },    },

    [onDetailsChange]    [onDetailsChange]

  );  );



  return (  return (

    <div className="border rounded-lg p-4">    <div className="border rounded-lg p-4">

      <div className="flex justify-between items-center mb-4">      <div className="flex justify-between items-center mb-4">

        <h3 className="text-lg font-medium text-gray-900">Glasgow Coma Scale</h3>        <h3 className="text-lg font-medium text-gray-900">Glasgow Coma Scale</h3>

        <div className="flex items-center gap-2">        <div className="flex items-center gap-2">

          <input          <input

            type="checkbox"            type="checkbox"

            id={id + '_verified'}            id={`${id}_verified`}

            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"

            checked={verification.verified}            checked={verification.verified}

            onChange={handleVerifiedChange}            onChange={handleVerifiedChange}

          />          />

          <label htmlFor={id + '_verified'} className="text-sm text-gray-700">          <label htmlFor={`${id}_verified`} className="text-sm text-gray-700">

            Verified            Verified

          </label>          </label>

        </div>        </div>

      </div>      </div>



      <div className="space-y-4">      <div className="space-y-4">

        <TextField        <TextField

          field={{          field={{

            id: id + '_time',            id: `${id}_time`,

            type: "text",            type: "text",

            label: "Time",            label: "Time",

            required: true            required: true

          }}          }}

          value={time}          value={time}

          onChange={(v) => onTimeChange(v)}          onChange={(v) => onTimeChange(v)}

        />        />



        <RadioField        <RadioField

          field={{          field={{

            id: id + '_eyeOpening',            id: `${id}_eyeOpening`,

            type: "radio",            type: "radio",

            label: "Eye Opening",            label: "Eye Opening",

            required: true,            required: true,

            options: eyeValues            options: eyeValues

          }}          }}

          value={values.eyeOpening}          value={values.eyeOpening}

          onChange={v => handleChange("eyeOpening", v)}          onChange={v => handleChange("eyeOpening", v)}

        />        />



        <RadioField        <RadioField

          field={{          field={{

            id: id + '_verbalResponse',            id: `${id}_verbalResponse`,

            type: "radio",            type: "radio",

            label: "Verbal Response",            label: "Verbal Response",

            required: true,            required: true,

            options: verbalValues            options: verbalValues

          }}          }}

          value={values.verbalResponse}          value={values.verbalResponse}

          onChange={v => handleChange("verbalResponse", v)}          onChange={v => handleChange("verbalResponse", v)}

        />        />



        <RadioField        <RadioField

          field={{          field={{

            id: id + '_motorResponse',            id: `${id}_motorResponse`,

            type: "radio",            type: "radio",

            label: "Motor Response",            label: "Motor Response",

            required: true,            required: true,

            options: motorValues            options: motorValues

          }}          }}

          value={values.motorResponse}          value={values.motorResponse}

          onChange={v => handleChange("motorResponse", v)}          onChange={v => handleChange("motorResponse", v)}

        />        />



        <div className="flex items-center gap-2">        <div className="flex items-center gap-2">

          <span className="font-medium">Total GCS:</span>          <span className="font-medium">Total GCS:</span>

          <span className="text-xl">{values.totalScore}</span>          <span className="text-xl">{values.totalScore}</span>

        </div>        </div>



        <div className="grid grid-cols-2 gap-4">        <div className="grid grid-cols-2 gap-4">

          <RadioField          <RadioField

            field={{            field={{

              id: id + '_pupilLeft',              id: `${id}_pupilLeft`,

              type: "radio",              type: "radio",

              label: "Left Pupil",              label: "Left Pupil",

              required: true,              required: true,

              options: pupilValues              options: pupilValues

            }}            }}

            value={values.pupilLeft}            value={values.pupilLeft}

            onChange={v => handleChange("pupilLeft", v)}            onChange={v => handleChange("pupilLeft", v)}

          />          />



          <RadioField          <RadioField

            field={{            field={{

              id: id + '_pupilRight',              id: `${id}_pupilRight`,

              type: "radio",              type: "radio",

              label: "Right Pupil",              label: "Right Pupil",

              required: true,              required: true,

              options: pupilValues              options: pupilValues

            }}            }}

            value={values.pupilRight}            value={values.pupilRight}

            onChange={v => handleChange("pupilRight", v)}            onChange={v => handleChange("pupilRight", v)}

          />          />

        </div>        </div>



        <TextField        <TextField

          field={{          field={{

            id: id + '_notes',            id: `${id}_notes`,

            type: "text",            type: "text",

            label: "Notes",            label: "Notes",

            required: false,            required: false,

            placeholder: "Additional observations..."            placeholder: "Additional observations..."

          }}          }}

          value={values.notes || ""}          value={values.notes || ""}

          onChange={v => handleChange("notes", v)}          onChange={v => handleChange("notes", v)}

        />        />

      </div>      </div>

    </div>    </div>

  );  );

}}
