import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AACBoard } from '@/types/aac';
import { useToast } from '@/hooks/use-toast';
import { convertMenuToBoards, MenuData, sanitizeMenuData } from '@/lib/menuToBoards';

export function useMenuScanner() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedBoards, setGeneratedBoards] = useState<Record<string, AACBoard> | null>(null);
  const { toast } = useToast();

  const processMenuImage = async (imageBase64: string, businessType?: string): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to use the menu scanner feature',
          variant: 'destructive',
        });
        return false;
      }

      const { data, error } = await supabase.functions.invoke('process-menu', {
        body: { imageBase64, businessType },
      });

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Authentication required. Please sign in again.');
        }
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to process menu');
      }

      const menuData: MenuData = data.data;
      const boards = convertMenuToBoards(sanitizeMenuData(menuData));
      setGeneratedBoards(boards);
      
      return true;
    } catch (error) {
      console.error('Error processing menu:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process menu',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processMenuUrl = async (url: string): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to use the URL import feature',
          variant: 'destructive',
        });
        return false;
      }

      const { data, error } = await supabase.functions.invoke('process-menu-url', {
        body: { url },
      });

      if (error) {
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Authentication required. Please sign in again.');
        }
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to process URL');
      }

      const menuData: MenuData = data.data;
      const boards = convertMenuToBoards(sanitizeMenuData(menuData));
      setGeneratedBoards(boards);
      
      return true;
    } catch (error) {
      console.error('Error processing URL:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process URL',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setGeneratedBoards(null);
    setIsProcessing(false);
  };

  return {
    isProcessing,
    generatedBoards,
    processMenuImage,
    processMenuUrl,
    setGeneratedBoards,
    reset,
  };
}
