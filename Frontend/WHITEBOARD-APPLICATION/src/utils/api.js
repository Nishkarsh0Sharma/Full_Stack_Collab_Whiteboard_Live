const API_BASE_URL = `${process.env.REACT_APP_API_URL}/canvas/`;

export const updateCanvas = async (id, elements, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ elements }),
    });

    if (!response.ok) throw new Error("Failed to update canvas");

    return await response.json();
  } catch (error) {
    console.error("Error updating canvas:", error);
    throw error;
  }
};

// DELETE canvas
export const deleteCanvas = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete canvas");

    return await response.json();
  } catch (error) {
    console.error("Error deleting canvas:", error);
    return { success: false };
  }
};
