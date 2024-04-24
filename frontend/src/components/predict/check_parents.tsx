import Switch from '@mui/material/Switch';
import { FormControl, FormControlLabel } from '@mui/material';
import {useState, useEffect} from 'react';

interface Props{
  setQuery: React.Dispatch<React.SetStateAction<any>>;
  query: {}
}

export default function CheckParents({query, setQuery}:Props){
  const [predict_parent, setPredictParent] = useState(true)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPredictParent(event.target.checked);
  };

  useEffect(() => {
    setQuery({ ...query, predict_parent: predict_parent })
  }, [predict_parent]);
  useEffect(()=>{
    setQuery({ ...query, predict_parent: predict_parent })
  }, [])

  return (
    <FormControl sx={{ m: 1 }} fullWidth>
      <FormControlLabel control={
        <Switch 
          checked={predict_parent}
          onChange={handleChange}/>
      } label="Predict parents" />
    </FormControl>
  )
}