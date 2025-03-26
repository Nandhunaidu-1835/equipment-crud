import React, { useEffect, useState, useRef } from 'react';
import { getEquipment,createEquipment,updateEquipment,deleteEquipment} from '../services/equipmentService';
import './EquipmentPage.css';

const EquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    status: false, // Active/Inactive
    priority: 1,
    equipment_type_group_id: '',
    equipment_type_id: '',
    site: '',
    serial_number: '',
    model_number: '',
    qrcode: '',
    asset_number: '',
    installation_date: '',
    warranty_start_date: '',
    warranty_end_date: '',
    out_of_service_flag: false,
    response_time: '',
    work_completion_time: '',
    location_1: '',
    location_2: '',
    location_3: '',
    location_4: '',
    equipment_oos: 'yes',
    sitestartup_account_id: '',
    rotatable: false,
    updated_by: '',
    updated_datetime: '',
    defectflag: false,
  });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const formRef = useRef(null); // Reference to the form

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await getEquipment();
      setEquipmentList(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } 
    else if (type === 'radio' && (value === 'true' || value === 'false')) {
      newValue = value === 'true';
    }
    else if (type === "number") {
        newValue = value === "" ? "" : Number(value); // Ensure empty number fields are set as empty strings
    } 
    else if (type === "number") {
      // Remove 'e' and ensure only numbers
      newValue = value.replace(/[eE-]/g, ""); 
    }
    else {
      newValue = value;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Remove error for this field
    }));
  };
  const regex = /^[A-Za-z0-9-]+$/; // Allows letters, numbers, and hyphen only
  const validateForm = (formData, setErrors) => {
    let errors = {};
    console.log("Form Data:", formData); // Debugging line
    Object.keys(formData).forEach((key) => {
      if (formData[key] === "" || formData[key] === null || formData[key] === undefined) {
        errors[key] = `${key.replace(/_/g, " ")} is required`;
      }
    });
    if (!regex.test(formData.code)) {
      errors.code="Must be Alphabetic or numerical"
    }
    else if (/^-+$/.test(formData.code)) {
      // This checks if the input is only one or more hyphens (not allowed)
      errors.code = "Cannot contain only special symbols";
    }

    if (formData.warranty_start_date && formData.warranty_end_date) {
      const startDate = new Date(formData.warranty_start_date);
      const endDate = new Date(formData.warranty_end_date);
      if (startDate >= endDate) {
          errors.warranty_start_date = "Warranty start date must before warranty end date";
          errors.warranty_end_date = "Warranty end date must be after warranty start date";
      }
    }
    setErrors(errors);
    console.log(errors);

    setTimeout(() => {
      const errorFields = formRef.current?.querySelectorAll(".error-field");
      if (errorFields.length > 0) {
        errorFields[0].scrollIntoView({ behavior: "smooth", block: "center" });
        errorFields[0].focus();
      }
    }, 0);
    return Object.keys(errors).length === 0; // Returns true if no errors 
  }; 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(formData, setErrors);
    if (!isValid) {
      console.log("Validation failed", errors);
      setErrorMessage("Please fix the errors in the form and try again.");
      setSuccessMessage("")
      return;
    }  
    console.log("Form submitted successfully", formData);
    try {
      const updatedFormData = {
        ...formData,
        updated_datetime: new Date().toISOString(),
      };
      setErrorMessage("");
      if (editId) {
        await updateEquipment(editId, updatedFormData);
        setSuccessMessage("Equipment updated successfully!");
      } else {
        await createEquipment(updatedFormData);
        setSuccessMessage("Equipment created successfully!");
      }
      resetForm();
      fetchEquipment();
    } catch (error) {
      console.error('Error saving equipment:', error);
      setErrorMessage("Failed to save equipment. Please try again.");
    }
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16); // Convert to proper format 
  };
  const handleEdit = (equipment) => {
    setFormData({
      ...equipment,
        installation_date: formatDateForInput(equipment.installation_date),
        warranty_start_date: formatDateForInput(equipment.warranty_start_date),
        warranty_end_date: formatDateForInput(equipment.warranty_end_date),
        updated_datetime: formatDateForInput(equipment.updated_datetime),
        defectflag: Boolean(equipment.defectflag), 
    });
    setEditId(equipment.id);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;

    try {
      await deleteEquipment(id);
      setSuccessMessage("Equipment deleted successfully!");
      resetForm(); // Clear the form after successful deletion
      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      setErrorMessage("Failed to delete equipment. Please try again.");
    }
  };
  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      status: false,
      priority: 1,
      equipment_type_group_id: '',
      equipment_type_id: '',
      site: '',
      serial_number: '',
      model_number: '',
      qrcode: '',
      asset_number: '',
      installation_date: '',
      warranty_start_date: '',
      warranty_end_date: '',
      out_of_service_flag: false,
      response_time: '',
      work_completion_time: '',
      location_1: '',
      location_2: '',
      location_3: '',
      location_4: '',
      equipment_oos: 'no',
      sitestartup_account_id: '',
      rotatable: false,
      updated_by: '',
      updated_datetime: '',
      defectflag: false,
    });
    setEditId(null);
  };

  const resetButtonForm = () => {
    resetForm();
    setErrorMessage("");
    setSuccessMessage("");
  }

  const toggleReadMore = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  return (
    <div className="equipment-container">
      <h2 className="page-title">Equipment Management</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="equipment-form">
        <div className="form-group" >
          <label>Code:<span className="required-star">*</span></label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            maxLength={15}
            className={errors.code ? "error-field" : ""}/>
          {errors.code && <span className="error">{errors.code}</span>}
        </div>

        <div className="form-group">
          <label>Equipment Type Group ID:<span className="required-star">*</span></label>
          <input
            type="number"
            name="equipment_type_group_id"
            className={`no-arrows ${errors.equipment_type_group_id ? "error-field" : ""}`}
            value={formData.equipment_type_group_id}
            onChange={handleInputChange}/>
          {errors.equipment_type_group_id && <span className="error">{errors.equipment_type_group_id}</span>}          
        </div>

        <div className="form-group">
          <label>Equipment Type ID:<span className="required-star">*</span></label>
          <input
            type="number"
            name="equipment_type_id"
            className={`no-arrows ${errors.equipment_type_id ? "error-field" : ""}`}
            value={formData.equipment_type_id}
            onChange={handleInputChange}/>
          {errors.equipment_type_id && <span className="error">{errors.equipment_type_id}</span>}          
        </div>

        <div className="form-group">
          <label>Site:<span className="required-star">*</span></label>
          <input
            type="number"
            name="site"
            className={`no-arrows ${errors.site ? "error-field" : ""}`}
            value={formData.site}
            onChange={handleInputChange}/>
          {errors.site && <span className="error">{errors.site}</span>}          
        </div>

        {/* Priority */}
        <div className="form-group">
          <label>Priority:<span className="required-star">*</span></label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}>
            <option value={1}>1 - High Priority</option>
            <option value={2}>2 - Medium Priority</option>
            <option value={3}>3 - Low Priority</option>
          </select>
          {errors.priority && <span className="error">{errors.priority}</span>}          
        </div>

        <div className="form-group">
          <label>Serial Number:<span className="required-star">*</span></label>
          <input
            type="text"
            name="serial_number"
            className={`no-arrows ${errors.serial_number ? "error-field" : ""}`}
            value={formData.serial_number}
            onChange={handleInputChange}/>
          {errors.serial_number && <span className="error">{errors.serial_number}</span>}          
        </div>

        <div className="form-group">
          <label>Model Number:<span className="required-star">*</span></label>
          <input
            type="text"
            name="model_number"
            className={`no-arrows ${errors.model_number ? "error-field" : ""}`}
            value={formData.model_number}
            onChange={handleInputChange}/>
          {errors.model_number && <span className="error">{errors.model_number}</span>}          
        </div>

        <div className="form-group">
          <label>QR Code:<span className="required-star">*</span></label>
          <input
            type="text"
            name="qrcode"
            className={`no-arrows ${errors.qrcode ? "error-field" : ""}`}
            value={formData.qrcode}
            onChange={handleInputChange}/>
          {errors.qrcode && <span className="error">{errors.qrcode}</span>}          
        </div>

        <div className="form-group">
          <label>Asset Number:<span className="required-star">*</span></label>
          <input
            type="text"
            name="asset_number"
            className={`no-arrows ${errors.asset_number ? "error-field" : ""}`}
            value={formData.asset_number}
            onChange={handleInputChange}/>
          {errors.asset_number && <span className="error">{errors.asset_number}</span>}                  
        </div>

        <div className="form-group">
          <label>Location 1:<span className="required-star">*</span></label>
          <input
            type="text"
            name="location_1"
            className={`no-arrows ${errors.location_1 ? "error-field" : ""}`}
            value={formData.location_1}
            maxLength={8}
            onChange={handleInputChange}/>
          {errors.location_1 && <span className="error">{errors.location_1}</span>}                  
        </div>

        <div className="form-group">
          <label>Location 2:<span className="required-star">*</span></label>
          <input
            type="text"
            name="location_2"
            className={`no-arrows ${errors.location_2 ? "error-field" : ""}`}
            value={formData.location_2}
            maxLength={8}
            onChange={handleInputChange}/>
          {errors.location_2 && <span className="error">{errors.location_2}</span>}                  
        </div>

        <div className="form-group">
          <label>Location 3:<span className="required-star">*</span></label>
          <input
            type="text"
            name="location_3"
            className={`no-arrows ${errors.location_3 ? "error-field" : ""}`}
            maxLength={8}
            value={formData.location_3}
            onChange={handleInputChange}/>
          {errors.location_3 && <span className="error">{errors.location_3}</span>}                  
        </div>

        <div className="form-group">
          <label>Location 4:<span className="required-star">*</span></label>
          <input
            type="text"
            name="location_4"
            className={`no-arrows ${errors.location_4 ? "error-field" : ""}`}
            value={formData.location_4}
            onChange={handleInputChange}/>
          {errors.location_4 && <span className="error">{errors.location_4}</span>}                  
        </div>

        <div className="form-group">
          <label>Response Time (Hours):<span className="required-star">*</span></label>
          <input
            type="number"
            name="response_time"
            className={`no-arrows ${errors.response_time ? "error-field" : ""}`}
            value={formData.response_time}
            onChange={handleInputChange}/>
          {errors.response_time && <span className="error">{errors.response_time}</span>}                  
        </div>

        <div className="form-group">
          <label>Work Completion Time (Hours):<span className="required-star">*</span></label>
          <input
            type="number"
            name="work_completion_time"
            className={`no-arrows ${errors.work_completion_time ? "error-field" : ""}`}
            value={formData.work_completion_time}
            onChange={handleInputChange}/>
          {errors.work_completion_time && <span className="error">{errors.work_completion_time}</span>}                  
        </div>

        <div className="form-group">
          <label>Equipment OOS:<span className="required-star">*</span></label>
          <select
          name="equipment_oos"
          value={formData.equipment_oos}
          onChange={handleInputChange}
          >
          <option value="yes">Yes</option>
          <option value="no">No</option>
         </select>
        {errors.equipment_oos && <span className="error">{errors.equipment_oos}</span>}
        </div>

        <div className="form-group">
          <label>Site Startup Account ID:<span className="required-star">*</span></label>
          <input
            type="number"
            name="sitestartup_account_id"
            className={`no-arrows ${errors.sitestartup_account_id ? "error-field" : ""}`}
            value={formData.sitestartup_account_id}
            onChange={handleInputChange}/>
          {errors.sitestartup_account_id && <span className="error">{errors.sitestartup_account_id}</span>}                  
        </div>

        <div className="form-group">
          <label>Updated By:<span className="required-star">*</span></label>
          <input
            type="number"
            name="updated_by"
            className={`no-arrows ${errors.updated_by ? "error-field" : ""}`}
            value={formData.updated_by}
            onChange={handleInputChange}/>
          {errors.updated_by && <span className="error">{errors.updated_by}</span>}                  
        </div>

        <div className="form-group">
          <label>Installation Date:<span className="required-star">*</span></label>
          <input
            type="datetime-local"
            name="installation_date"
            className={`no-arrows ${errors.installation_date ? "error-field" : ""}`}
            value={formData.installation_date || ""}
            onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })} />
          {errors.installation_date && <span className="error">{errors.installation_date}</span>}                  
        </div>

        <div className="form-group">
          <label>Warranty Start Date:<span className="required-star">*</span></label>
          <input
            type="datetime-local"
            name="warranty_start_date"
            className={`no-arrows ${errors.warranty_start_date ? "error-field" : ""}`}
            value={formData.warranty_start_date || ""}
            onChange={(e) => setFormData({ ...formData, warranty_start_date: e.target.value })} />
          {errors.warranty_start_date && <span className="error">{errors.warranty_start_date}</span>}                  
        </div>

        <div className="form-group">
          <label>Warranty End Date:<span className="required-star">*</span></label>
          <input
            type="datetime-local"
            name="warranty_end_date"
            className={`no-arrows ${errors.warranty_end_date ? "error-field" : ""}`}
            value={formData.warranty_end_date || ""}
            onChange={(e) => setFormData({ ...formData, warranty_end_date: e.target.value })} />
          {errors.warranty_end_date && <span className="error">{errors.warranty_end_date}</span>}                  
        </div>

        <div className="form-group">
          <label>Description:<span className="required-star">*</span></label>
          <textarea
            name="description"
            className={`no-arrows ${errors.description ? "error-field" : ""}`}
            value={formData.description}
            onChange={handleInputChange}/>
          {errors.description && <span className="error">{errors.description}</span>}                  
        </div>


        <div className="form-group">
          <label>Updated Datetime:<span className="required-star">*</span></label>
          <input
            type="datetime-local"
            name="updated_datetime"
            className={`no-arrows ${errors.updated_datetime ? "error-field" : ""}`}
            value={formData.updated_datetime || ""}
            onChange={(e) => setFormData({ ...formData, updated_datetime: e.target.value })} />
          {errors.updated_datetime && <span className="error">{errors.updated_datetime}</span>}                  
        </div>

        {/* Defect Flag */}
        <div className="form-group">
          <label>Defect Flag:<span className="required-star">*</span></label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="defectflag"
                value={true}
                checked={formData.defectflag === true}
                onChange={handleInputChange}/>
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="defectflag"
                value={false}
                checked={formData.defectflag === false}
                onChange={handleInputChange}/>
              No
            </label>
          </div>
          {errors.defectflag && <span className="error">{errors.defectflag}</span>}                  
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status:<span className="required-star">*</span></label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="status"
                value={true}
                checked={formData.status === true}
                onChange={handleInputChange}/>
              Active
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value={false}
                checked={formData.status === false}
                onChange={handleInputChange}/>
              Inactive
            </label>
          </div>
          {errors.status && <span className="error">{errors.status}</span>}                  
        </div>
        {/* Out of Service Flag */}
        <div className="form-group">
          <label>Out of Service:<span className="required-star">*</span></label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="out_of_service_flag"
                value={true}
                checked={formData.out_of_service_flag === true}
                onChange={handleInputChange}/>
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="out_of_service_flag"
                value={false}
                checked={formData.out_of_service_flag === false}
                onChange={handleInputChange}/>
              No
            </label>
          </div>
          {errors.out_of_service_flag && <span className="error">{errors.out_of_service_flag}</span>}                  
        </div>

        {/* Rotatable */}
        <div className="form-group">
          <label>Rotatable:<span className="required-star">*</span></label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="rotatable"
                value={true}
                checked={formData.rotatable === true}
                onChange={handleInputChange}/>
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="rotatable"
                value={false}
                checked={formData.rotatable === false}
                onChange={handleInputChange}/>
              No
            </label>
          </div>
          {errors.rotatable && <span className="error">{errors.rotatable}</span>}                  
        </div>

        <div class="submit-btn-container">
        <button type="submit" className="submit-btn">
          {editId ? 'Update' : 'Create'} Equipment
        </button>
        <div className="message-container">
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        </div>
      </form>
      <br />

      {/* Table Rendering */}
      <div className="table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>S.No <span className="sort-icons">⬇️</span></th>
              <th>Code <span className="sort-icons">⬇️</span></th>
              <th>Description <span className="sort-icons">⬇️</span></th>
              <th>Equipment Type Group ID <span className="sort-icons">⬇️</span></th>
              <th>Equipment Type ID <span className="sort-icons">⬇️</span></th>
              <th>Site <span className="sort-icons">⬇️</span></th>
              <th>Serial Number <span className="sort-icons">⬇️</span></th>
              <th>Model Number <span className="sort-icons">⬇️</span></th>
              <th>QR Code <span className="sort-icons">⬇️</span></th>
              <th>Asset Number <span className="sort-icons">⬇️</span></th>
              <th>Status <span className="sort-icons">⬇️</span></th>
              <th>Installation Date <span className="sort-icons">⬇️</span></th>
              <th>Warranty Start Date <span className="sort-icons">⬇️</span></th>
              <th>Warranty End Date <span className="sort-icons">⬇️</span></th>
              <th>Out of Service <span className="sort-icons">⬇️</span></th>
              <th>Priority <span className="sort-icons">⬇️</span></th>
              <th>Response Time (hrs) <span className="sort-icons">⬇️</span></th>
              <th>Work Completion Time (hrs) <span className="sort-icons">⬇️</span></th>
              <th>Location 1 <span className="sort-icons">⬇️</span></th>
              <th>Location 2 <span className="sort-icons">⬇️</span></th>
              <th>Location 3 <span className="sort-icons">⬇️</span></th>
              <th>Location 4 <span className="sort-icons">⬇️</span></th>
              <th>Equipment OOS <span className="sort-icons">⬇️</span></th>
              <th>Site Startup Account ID <span className="sort-icons">⬇️</span></th>
              <th>Rotatable <span className="sort-icons">⬇️</span></th>
              <th>Updated By <span className="sort-icons">⬇️</span></th>
              <th>Updated Datetime <span className="sort-icons">⬇️</span></th>
              <th>Defect Flag <span className="sort-icons">⬇️</span></th>
              <th>Actions</th>
            </tr>
         </thead>
         <tbody>
          {equipmentList.length === 0 ? (
              <tr>
                <td colSpan="29">No equipment found</td>
              </tr>) 
              : (
                equipmentList.map((eq) => (
                <tr key={eq.id}>
                <td>{eq.id}</td>
                <td>{eq.code}</td>
                <td>
                {expandedRows.includes(eq.id) ? (
                <>
                {eq.description}
                <span
                className="read-more"
                onClick={() => toggleReadMore(eq.id)}>
                {' '}Show Less
                </span>
                </>) : 
                (
                <>
                {eq.description.length > 20
                ? `${eq.description.substring(0, 20)}...`
                : eq.description}
                {eq.description.length > 20 && (
                <span
                  className="read-more"
                  onClick={() => toggleReadMore(eq.id)}>
                  {' '}Read More
                </span>
              )}
            </>
          )}
        </td>
        <td>{eq.equipment_type_group_id}</td>
        <td>{eq.equipment_type_id}</td>
        <td>{eq.site}</td>
        <td>{eq.serial_number}</td>
        <td>{eq.model_number}</td>
        <td>{eq.qrcode}</td>
        <td>{eq.asset_number}</td>
        <td>{eq.status ? 'Active' : 'Inactive'}</td>
        <td>{new Date(eq.installation_date).toLocaleDateString()}</td>
        <td>{new Date(eq.warranty_start_date).toLocaleDateString()}</td>
        <td>{new Date(eq.warranty_end_date).toLocaleDateString()}</td>
        <td>{eq.out_of_service_flag ? 'Yes' : 'No'}</td>
        <td>
          {eq.priority === 1
            ? '1 - High Priority'
            : eq.priority === 2
            ? '2 - Medium Priority'
            : '3 - Low Priority'}
        </td>
        <td>{eq.response_time} hrs</td>
        <td>{eq.work_completion_time} hrs</td>
        <td>{eq.location_1}</td>
        <td>{eq.location_2}</td>
        <td>{eq.location_3}</td>
        <td>{eq.location_4}</td>
        <td>{eq.equipment_oos ? eq.equipment_oos : 'N/A'}</td>
        <td>{eq.sitestartup_account_id}</td>
        <td>{eq.rotatable ? 'Yes' : 'No'}</td>
        <td>{eq.updated_by}</td>
        <td>{new Date(eq.updated_datetime).toLocaleString()}</td>
        <td>{eq.defectflag === 1 ? 'Yes' : 'No'}</td>
        <td>
          <button className="edit-btn" onClick={() => handleEdit(eq)}>✏️</button>
          <button className="delete-btn" onClick={() => handleDelete(eq.id)}>✖️</button>
          <button className="reset-btn" onClick={resetButtonForm}>🔄</button> 
        </td>
      </tr>
     )))}
         </tbody>
        </table>
      </div>
      </div>
  );
};
export default EquipmentPage;
