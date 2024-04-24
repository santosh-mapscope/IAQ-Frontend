import React, { useState, Component } from "react";
// import Accordion from "react-bootstrap/Accordion";
// import DataTable from "react-data-table-component";
import { Helmet } from "react-helmet";
// import Form from "react-bootstrap/Form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "react-dual-listbox/lib/react-dual-listbox.css";
import Table from "react-bootstrap/Table";

import "./Charts/charts.css";

import DualListBox from "react-dual-listbox";

const options = [
  { value: "one", label: "Option One" },
  { value: "two", label: "Option Two" },
];

const data = [
  {
    slNo: "01",
    floor: "Ground",
    location: "Outdoor",
    cotwo: "353",
    co: "4",
    temp: "18",
    humidity: "66.5",
    particulate: "8",
    tov: "110",
    date: "6/2/2023 09:49:32 AM",
    am: "1",
    inout: "0",
  },
  {
    slNo: "02",
    floor: "Ground",
    location: "Outdoor",
    cotwo: "353",
    co: "4",
    temp: "18",
    humidity: "66.5",
    particulate: "8",
    tov: "110",
    date: "6/2/2023 09:49:32 AM",
    am: "1",
    inout: "0",
  },
  {
    slNo: "03",
    floor: "Ground",
    location: "Outdoor",
    cotwo: "353",
    co: "4",
    temp: "18",
    humidity: "66.5",
    particulate: "8",
    tov: "110",
    date: "6/2/2023 09:49:32 AM",
    am: "1",
    inout: "0",
  },
];

function TemplateCode() {
  const [employeeData, setEmployeeData] = React.useState(data);

  const onChange = (e,  slNo) => {
    const { name, value } = e.target;

    const editData = employeeData.map((item) =>
      item. slNo ===  slNo && name ? { ...item, [name]: value } : item
    );

    setEmployeeData(editData);
  };
  

const [selected, setSelected] = useState([]);
const hendelsubmit = () => {
  // console.log("Modified Data:", employeeData);
}



const [editorContent, setEditorContent] = useState('');
const [editor, setEditor] = useState(null);

const handleEditorChange = (event, editor) => {
  const data = editor.getData();
  // Do something with the updated content
  // console.log('Updated content:', data);
};

const handleSelectChange = (event) => {
  const selectedText = event.target.value;
  if (editor) {
    const existingContent = editor.getData();
    const newContent = `${existingContent} ${selectedText}`; // Append new content
    editor.setData(newContent);
    setEditorContent(newContent);
  }
};

const handleImageUpload = async (file) => {
  try {
    // Simulate image upload - you'd typically send the file to your server and get the image URL
    const imageUrl = await uploadImage(file);
    
    if (editor) {
      const existingContent = editor.getData();
      const imageElement = `<img src="${imageUrl}" alt="Uploaded Image" />`;
      const newContent = `${existingContent} ${imageElement}`; // Append image
      editor.setData(newContent);
      setEditorContent(newContent);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    // Simulating image upload with setTimeout
    setTimeout(() => {
      // In a real scenario, you'd handle the upload to a server here and get the image URL
      const imageUrl = 'https://via.placeholder.com/150'; // Replace this with your actual image URL
      resolve(imageUrl);
    }, 1000); // Simulating a delay for upload
  });
};



  return (
    <>
      <Helmet title={"Template Code | IAQ Reporting System"} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-4">
              <div className="col-sm-3">
                <h5 className="m-0 mt-3 mb-2">Template Code</h5>
              </div>
            </div>
          </div>
        </div>

        {/*start text editor*/}
        <section>
        <select onChange={handleSelectChange}>
        <option value="">Select text</option>
        <option value="Text 1">Text 1</option>
        <option value="Text 2">Text 2</option>
        <option value="Text 3">Text 3</option>
        {/* Add other options as needed */}
      
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
        </section>
        <section>
        <CKEditor
            editor={ClassicEditor}
            data={editorContent}
            onChange={handleEditorChange}
            onReady={(editor) => setEditor(editor)}
      />
        </section>
        {/*end of text editor*/}

        <section className="mt-4">
          <DualListBox
            options={options}
            selected={ selected}
            onChange={(value) => setSelected(value)}
          />
        </section>

        <section className="mt-4">
          <div className="upload-csv-table">
            <h6 className="title mb-4">ReactJS Editable Table</h6>
            <Table striped responsive='lg'>
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Floor</th>
                  <th>Location</th>
                  <th>CO₂(ppm)</th>
                  <th>CO(ppm)</th>
                  <th>Temp</th>
                  <th>Rel. Humidity</th>
                  <th>Particulate</th>
                  <th>TOV(ppb)</th>
                  <th width="17%">Date/Time</th>
                  <th>AM/PM</th>
                  <th>In/Out</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map(({  slNo, floor, location, cotwo , co, temp, humidity, particulate, tov, date, am, inout}) => (
                  <tr key={ slNo}>
                    <td>
                      <input
                        name="slNo"
                        value={slNo}
                        type="number"
                        disabled
                        // placeholder="Type Floor"
                      />
                    </td>
                    <td>
                      <input
                        name="floor"
                        disabled
                        value={floor}
                        type="text"
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Floor"
                      />
                    </td>
                    <td>
                      <input
                        name="location"
                        value={location}
                        type="text"
                        disabled
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Email"
                      />
                    </td>
                    <td>
                      <input
                        disabled
                        name="cotwo"
                        type="number"
                        value={cotwo}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                        disabled
                        name="co"
                        type="number"
                        value={co}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                     
                        name="temp"
                        type="number"
                        value={temp}
                        className="bg-danger text-white text-center"
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                        name="humidity"
                        type="number"
                        disabled
                        value={humidity}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                        name="particulate"
                        type="number"
                        disabled
                        value={particulate}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                        name="tov"
                        type="number"
                        disabled
                        value={tov}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                        name="date"
                        type="text"
                        disabled
                        value={date}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                        name="am"
                        type="number"
                        disabled
                        value={am}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                    <td>
                      <input
                        name="inout"
                        type="number"
                        disabled
                        value={inout}
                        onChange={(e) => onChange(e,  slNo)}
                        // placeholder="Type Position"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <button onClick={hendelsubmit}>submit</button>
          </div>
        </section>
      </div>
    </>
  );
}
export default TemplateCode;