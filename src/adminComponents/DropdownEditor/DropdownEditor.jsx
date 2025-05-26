import { useState, useEffect } from "react";
import { Save, PlusCircle, Trash2, RefreshCw, Move } from "lucide-react";
import styles from "./DropdownEditor.module.css";

const API_URL = "https://lacocina-backend-deploy.vercel.app";

const DropdownEditor = () => {
  const [dropdownCategories, setDropdownCategories] = useState([
    //CURSO
    { id: "curso", name: "Curso", options: [] },
    //COMPAÑIA
    { id: "compania", name: "Compañía", options: [] },
    { id: "industriaSector", name: "Industria/Sector", options: [] },
    { id: "areaDesempeno", name: "Área de Desempeño", options: [] },
    { id: "cargo", name: "Cargo/Posición", options: [] }
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingOptions, setEditingOptions] = useState({}); // Local editing state
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  
  // Cargar datos desde la API al iniciar
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const categoriesWithOptions = await Promise.all(
          dropdownCategories.map(async (category) => {
            const response = await fetch(`${API_URL}/desplegables/${category.id}`);
            if (!response.ok) throw new Error("Error al cargar opciones");
            const options = await response.json();
            return {
              ...category,
              options: options.map(opt => opt.valor)
            };
          })
        );
        setDropdownCategories(categoriesWithOptions);
      } catch (err) {
        setError("Error al cargar opciones: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDropdowns();
  }, []);

  // Seleccionar una categoría para editar
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setEditingOptions({}); // Reset editing state when changing categories
    setDraggedIndex(null); // Reset drag state when changing categories
    setError(null);
    setSuccess(null);
  };

  // Manejar cambios en los campos de texto (actualización local)
  const handleOptionChange = (index, newValue) => {
    setEditingOptions({
      ...editingOptions,
      [index]: newValue
    });
  };

  // Guardar una opción editada en el servidor
  const handleSaveOption = async (index) => {
    if (!selectedCategory || !editingOptions[index]) return;
    
    try {
      setSaving(true);
      // Primero necesitamos obtener el ID de la opción
      const response = await fetch(`${API_URL}/desplegables/${selectedCategory.id}`);
      if (!response.ok) throw new Error("Error al obtener opciones");
      const opciones = await response.json();
      
      if (!opciones[index]) {
        throw new Error("Opción no encontrada");
      }
      
      const opcionId = opciones[index].id;
      
      const updateResponse = await fetch(`${API_URL}/desplegables/${opcionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor: editingOptions[index] })
      });
      
      if (!updateResponse.ok) throw new Error("Error al actualizar opción");
      
      // Actualizar el state de categorías con el nuevo valor
      const updatedCategories = dropdownCategories.map(category => {
        if (category.id === selectedCategory.id) {
          const newOptions = [...category.options];
          newOptions[index] = editingOptions[index];
          return {
            ...category,
            options: newOptions
          };
        }
        return category;
      });
      
      setDropdownCategories(updatedCategories);
      
      // Actualizar también el selectedCategory para reflejar el cambio inmediatamente
      const updatedSelectedCategory = updatedCategories.find(c => c.id === selectedCategory.id);
      setSelectedCategory(updatedSelectedCategory);
      
      // Clear the editing state for this option
      const newEditingOptions = {...editingOptions};
      delete newEditingOptions[index];
      setEditingOptions(newEditingOptions);
      
      setSuccess("Opción actualizada correctamente");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Agregar una nueva opción a la categoría seleccionada
  const handleAddOption = async () => {
    if (!selectedCategory) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/desplegables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoria: selectedCategory.id,
          valor: "Nueva opción"
        })
      });
      
      if (!response.ok) throw new Error("Error al agregar opción");
      
      const nuevaOpcion = await response.json();
      
      const updatedCategories = dropdownCategories.map(category => {
        if (category.id === selectedCategory.id) {
          return {
            ...category,
            options: [...category.options, nuevaOpcion.valor]
          };
        }
        return category;
      });
      
      setDropdownCategories(updatedCategories);
      setSelectedCategory(updatedCategories.find(c => c.id === selectedCategory.id));
      setSuccess("Opción agregada correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Eliminar una opción
  const handleDeleteOption = async (index) => {
    if (!selectedCategory) return;
    
    // Confirmar eliminación
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta opción?')) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Reset drag state para evitar conflictos
      setDraggedIndex(null);
      
      // Obtener el ID de la opción a eliminar
      const response = await fetch(`${API_URL}/desplegables/${selectedCategory.id}`);
      if (!response.ok) throw new Error("Error al obtener opciones");
      const opciones = await response.json();
      
      if (!opciones[index]) {
        throw new Error("Opción no encontrada");
      }
      
      const opcionId = opciones[index].id;
      
      // Verificar si es "Otro"
      if (opciones[index].valor.toLowerCase() === "otro") {
        setError("No se puede eliminar la opción 'Otro'");
        setTimeout(() => setError(null), 5000);
        return;
      }
      
      const deleteResponse = await fetch(`${API_URL}/desplegables/${opcionId}`, {
        method: 'DELETE'
      });
      
      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al eliminar opción");
      }
      
      // Actualizar el estado local
      const updatedCategories = dropdownCategories.map(category => {
        if (category.id === selectedCategory.id) {
          const newOptions = [...category.options];
          newOptions.splice(index, 1);
          return {
            ...category,
            options: newOptions
          };
        }
        return category;
      });
      
      setDropdownCategories(updatedCategories);
      setSelectedCategory(updatedCategories.find(c => c.id === selectedCategory.id));
      
      // Limpiar estados de edición que puedan haber quedado obsoletos
      const newEditingOptions = {...editingOptions};
      // Eliminar cualquier estado de edición para índices >= al eliminado
      Object.keys(newEditingOptions).forEach(key => {
        const keyIndex = parseInt(key);
        if (keyIndex >= index) {
          delete newEditingOptions[key];
        }
      });
      setEditingOptions(newEditingOptions);
      
      setSuccess("Opción eliminada correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error al eliminar opción:', err);
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Función para iniciar el arrastre
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // Función para manejar el arrastre sobre un elemento
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Validar que los índices sean válidos
    if (!selectedCategory || 
        draggedIndex < 0 || 
        draggedIndex >= selectedCategory.options.length ||
        index < 0 || 
        index >= selectedCategory.options.length) {
      return;
    }
    
    // Reordenar las opciones localmente (el guardado final se hace en handleDragEnd)
    const updatedCategories = dropdownCategories.map(category => {
      if (category.id === selectedCategory.id) {
        const newOptions = [...category.options];
        const draggedOption = newOptions[draggedIndex];
        
        // Eliminar la opción arrastrada de su posición original
        newOptions.splice(draggedIndex, 1);
        // Insertar en la nueva posición
        newOptions.splice(index, 0, draggedOption);
        
        return {
          ...category,
          options: newOptions
        };
      }
      return category;
    });
    
    setDropdownCategories(updatedCategories);
    setSelectedCategory(updatedCategories.find(c => c.id === selectedCategory.id));
    setDraggedIndex(index);
  };

  // Reordenar opciones
  const handleDragEnd = async () => {
    if (draggedIndex === null || !selectedCategory) {
      setDraggedIndex(null);
      return;
    }
    
    try {
      setSaving(true);
      
      // Obtener los IDs actuales en el orden correcto
      const response = await fetch(`${API_URL}/desplegables/${selectedCategory.id}`);
      if (!response.ok) throw new Error("Error al obtener opciones");
      const opciones = await response.json();
      
      // Crear array de IDs en el nuevo orden basado en el estado actual
      const opcionIds = selectedCategory.options.map((optionValue, index) => {
        const opcion = opciones.find(opt => opt.valor === optionValue);
        return opcion ? opcion.id : null;
      }).filter(id => id !== null);
      
      // Enviar el nuevo orden al backend
      const reorderResponse = await fetch(
        `${API_URL}/desplegables/${selectedCategory.id}/reordenar`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ opciones: opcionIds })
        }
      );
      
      if (!reorderResponse.ok) throw new Error("Error al reordenar opciones");
      
      setSuccess("Opciones reordenadas correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setDraggedIndex(null);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.editorContainer}>
        <div className={styles.loadingMessage}>Cargando opciones...</div>
      </div>
    );
  }

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.editorTitle}>Editor de Desplegables</h2>
      <p className={styles.editorDescription}>
        Modifica las opciones que aparecen en los menús desplegables del formulario.
      </p>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      
      <div className={styles.content}>
        <div className={styles.categoriesList}>
          <h3>Categorías</h3>
          {dropdownCategories.map((category) => (
            <div 
              key={category.id}
              className={`${styles.categoryItem} ${selectedCategory?.id === category.id ? styles.selected : ''}`}
              onClick={() => handleSelectCategory(category)}
            >
              {category.name}
              <span className={styles.optionsCount}>{category.options.length} opciones</span>
            </div>
          ))}
        </div>
        
        <div className={styles.optionsEditor}>
          {selectedCategory ? (
            <>
              <div className={styles.editorHeader}>
                <h3>Opciones para {selectedCategory.name}</h3>
              </div>
              
              <div className={styles.optionsList}>
                {selectedCategory.options.map((option, index) => (
                  <div 
                    key={`${selectedCategory.id}-${index}-${option}`}
                    className={styles.optionItem}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className={styles.dragHandle}>
                      <Move size={16} />
                    </div>
                    <input
                      type="text"
                      value={editingOptions[index] !== undefined ? editingOptions[index] : option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className={styles.optionInput}
                    />
                    {editingOptions[index] !== undefined && (
                      <button 
                        className={styles.saveButton}
                        onClick={() => handleSaveOption(index)}
                        title="Guardar cambios"
                        disabled={saving}
                      >
                        <Save size={16} />
                      </button>
                    )}
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteOption(index)}
                      title="Eliminar opción"
                      disabled={saving}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                className={styles.addButton}
                onClick={handleAddOption}
                disabled={saving}
              >
                <PlusCircle size={16} />
                Agregar opción
              </button>
              
              <div className={styles.infoBox}>
                <p>
                  <strong>Nota:</strong> La opción "Otro" siempre debe estar disponible y no se puede eliminar.
                  Puedes reorganizar las opciones arrastrándolas.
                </p>
              </div>
            </>
          ) : (
            <div className={styles.noSelection}>
              <p>Selecciona una categoría para editar sus opciones</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DropdownEditor;