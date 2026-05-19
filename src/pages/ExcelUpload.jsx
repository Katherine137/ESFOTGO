import { useState } from 'react';
import axios from 'axios';

function ExcelUpload() {

  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    if (!file) {
      alert('Seleccione un archivo');
      return;
    }

    const formData = new FormData();

    formData.append('file', file);

    try {

      const response = await axios.post(
        'http://localhost:3001/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log(response.data);

      alert('Archivo procesado');

    } catch (error) {
      console.log(error);
      alert('Error subiendo archivo');
    }
  };

  return (
    <div>
      <h2>Carga Masiva Excel</h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Subir
      </button>
    </div>
  );
}

export default ExcelUpload;