
-- Create a function to count unread messages grouped by sender
CREATE OR REPLACE FUNCTION count_unread_messages_by_sender(current_user_id UUID)
RETURNS TABLE (sender_id UUID, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.sender_id,
    COUNT(*)::BIGINT
  FROM 
    private_messages pm
  WHERE 
    pm.receiver_id = current_user_id
    AND pm.read = false
  GROUP BY 
    pm.sender_id;
END;
$$ LANGUAGE plpgsql;
