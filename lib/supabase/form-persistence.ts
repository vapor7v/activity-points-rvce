import { createSupabaseBrowser } from "./client";
import { FormFillerData } from "../types/form-filler";

export interface ActivityForm {
  id: string;
  user_id: string;
  form_data: FormFillerData;
  created_at: string;
  updated_at: string;
}

/**
 * Save form data to Supabase
 * Creates new entry if doesn't exist, updates if exists
 */
export async function saveFormData(formData: FormFillerData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseBrowser();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if form exists
    const { data: existingForm } = await supabase
      .from("activity_forms")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingForm) {
      // Update existing form
      const { error } = await supabase
        .from("activity_forms")
        .update({ form_data: formData })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating form:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new form
      const { error } = await supabase
        .from("activity_forms")
        .insert({
          user_id: user.id,
          form_data: formData,
        });

      if (error) {
        console.error("Error creating form:", error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in saveFormData:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Load form data from Supabase
 */
export async function loadFormData(): Promise<{ data?: FormFillerData; error?: string }> {
  try {
    const supabase = createSupabaseBrowser();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "User not authenticated" };
    }

    // Load form data
    const { data, error } = await supabase
      .from("activity_forms")
      .select("form_data")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found - this is not an error
        return { data: undefined };
      }
      console.error("Error loading form:", error);
      return { error: error.message };
    }

    // Normalize activities to ensure new fields exist
    const formData = data.form_data as FormFillerData;
    if (formData.activities) {
      formData.activities = formData.activities.map(activity => ({
        ...activity,
        photos: activity.photos || [],
        certificateImages: activity.certificateImages || [],
      }));
    }

    return { data: formData };
  } catch (error) {
    console.error("Error in loadFormData:", error);
    return { error: String(error) };
  }
}

/**
 * Migrate data from localStorage to Supabase
 */
export async function migrateLocalStorageData(): Promise<{ success: boolean; migrated: boolean; error?: string }> {
  try {
    // Check if there's data in localStorage
    const localData = localStorage.getItem("aicte-form-data");
    if (!localData) {
      return { success: true, migrated: false };
    }

    // Check if user already has data in database
    const { data: dbData } = await loadFormData();
    if (dbData) {
      // User already has data in database, don't overwrite
      return { success: true, migrated: false };
    }

    // Parse and save localStorage data to database
    const parsedData = JSON.parse(localData) as FormFillerData;
    const result = await saveFormData(parsedData);

    if (result.success) {
      // Migration successful, we can optionally clear localStorage
      // localStorage.removeItem("aicte-form-data");
      return { success: true, migrated: true };
    }

    return { success: false, migrated: false, error: result.error };
  } catch (error) {
    console.error("Error migrating localStorage data:", error);
    return { success: false, migrated: false, error: String(error) };
  }
}

/**
 * Debounce utility for auto-save
 */
export function createDebouncedSave(delay: number = 30000) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (formData: FormFillerData) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      const result = await saveFormData(formData);
      if (result.success) {
        console.log("Form auto-saved successfully");
      } else {
        console.error("Auto-save failed:", result.error);
      }
    }, delay);
  };
}
