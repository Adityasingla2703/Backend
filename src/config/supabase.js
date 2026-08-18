const { createClient } = require('@supabase/supabase-js');

/**
 * Supabase Database Configuration
 * Initialize Supabase client
 */

let supabase;

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    console.log('✅ Supabase initialized successfully');
  } else {
    console.log('⚠️  Supabase credentials not found. Database features will be disabled.');
  }
} catch (error) {
  console.error('❌ Supabase initialization error:', error.message);
}

/**
 * Save campaign to Supabase
 * @param {string} userId - User ID
 * @param {Object} campaignData - Campaign data to save
 * @returns {Promise<Object>} - Saved campaign with ID
 */
async function saveCampaignSupabase(userId, campaignData) {
  try {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabase
      .from('campaigns')
      .insert([
        {
          user_id: userId,
          business_name: campaignData.metadata?.businessName,
          business_category: campaignData.metadata?.businessCategory,
          location: campaignData.metadata?.location,
          daily_budget: campaignData.metadata?.dailyBudget,
          goal: campaignData.metadata?.goal,
          campaign_data: campaignData,
          created_at: new Date()
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Campaign saved to Supabase: ${data[0]?.id}`);
    return data[0];
  } catch (error) {
    console.error('❌ Supabase save error:', error);
    throw error;
  }
}

/**
 * Get user's campaigns from Supabase
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of campaigns
 */
async function getUserCampaignsSupabase(userId) {
  try {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Supabase fetch error:', error);
    throw error;
  }
}

/**
 * Delete campaign from Supabase
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<void>}
 */
async function deleteCampaignSupabase(campaignId) {
  try {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      throw error;
    }

    console.log(`✅ Campaign deleted from Supabase: ${campaignId}`);
  } catch (error) {
    console.error('❌ Supabase delete error:', error);
    throw error;
  }
}

/**
 * Get campaign by ID from Supabase
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} - Campaign data
 */
async function getCampaignSupabase(campaignId) {
  try {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Supabase fetch error:', error);
    throw error;
  }
}

module.exports = {
  supabase,
  saveCampaignSupabase,
  getUserCampaignsSupabase,
  deleteCampaignSupabase,
  getCampaignSupabase
};
