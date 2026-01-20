import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AACBoard, AACCell, FitzgeraldCategory } from '@/types/aac';
import { useToast } from '@/hooks/use-toast';

interface MenuCategory {
  id: string;
  name: string;
  nameHe: string;
  items: Array<{
    id: string;
    text: string;
    textEn: string;
    category: FitzgeraldCategory;
    icon: string;
  }>;
}

interface MenuData {
  businessName: string;
  businessNameHe: string;
  categories: MenuCategory[];
}

export function useMenuScanner() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedBoards, setGeneratedBoards] = useState<Record<string, AACBoard> | null>(null);
  const { toast } = useToast();

  const processMenuImage = async (imageBase64: string): Promise<boolean> => {
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
        body: { imageBase64 },
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
      const boards = convertMenuToBoards(menuData);
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
      const boards = convertMenuToBoards(menuData);
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

  const convertMenuToBoards = (menuData: MenuData): Record<string, AACBoard> => {
    const boards: Record<string, AACBoard> = {};

    // Create main board with category links
    const mainCells: AACCell[] = menuData.categories.map(category => ({
      id: `cat-${category.id}`,
      text: category.nameHe,
      textEn: category.name,
      category: 'people' as FitzgeraldCategory,
      icon: getCategoryIcon(category.name),
      linkToBoardId: category.id,
    }));

    boards.main = {
      id: 'main',
      name: menuData.businessNameHe || 'תפריט',
      nameEn: menuData.businessName || 'Menu',
      cells: mainCells,
      gridSize: {
        cols: Math.min(Math.ceil(Math.sqrt(mainCells.length)), 4),
        rows: Math.ceil(mainCells.length / 4),
      },
    };

    // Create sub-boards for each category
    menuData.categories.forEach(category => {
      const cells: AACCell[] = category.items.map(item => ({
        id: item.id,
        text: item.text,
        textEn: item.textEn,
        category: item.category,
        icon: item.icon,
      }));

      boards[category.id] = {
        id: category.id,
        name: category.nameHe,
        nameEn: category.name,
        parentBoardId: 'main',
        cells,
        gridSize: {
          cols: Math.min(Math.ceil(Math.sqrt(cells.length + 1)), 4),
          rows: Math.ceil((cells.length + 1) / 4),
        },
      };
    });

    return boards;
  };

  const getCategoryIcon = (categoryName: string): string => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('drink') || lowerName.includes('beverage')) return '🥤';
    if (lowerName.includes('hot')) return '☕';
    if (lowerName.includes('cold')) return '🧊';
    if (lowerName.includes('coffee')) return '☕';
    if (lowerName.includes('tea')) return '🍵';
    if (lowerName.includes('dessert') || lowerName.includes('sweet')) return '🍰';
    if (lowerName.includes('breakfast')) return '🍳';
    if (lowerName.includes('lunch') || lowerName.includes('main')) return '🍽️';
    if (lowerName.includes('salad')) return '🥗';
    if (lowerName.includes('soup')) return '🍲';
    if (lowerName.includes('sandwich')) return '🥪';
    if (lowerName.includes('pizza')) return '🍕';
    if (lowerName.includes('burger')) return '🍔';
    if (lowerName.includes('pasta')) return '🍝';
    if (lowerName.includes('snack')) return '🍿';
    if (lowerName.includes('ice cream')) return '🍦';
    if (lowerName.includes('appetizer') || lowerName.includes('starter')) return '🥗';
    if (lowerName.includes('side')) return '🍟';
    if (lowerName.includes('meat') || lowerName.includes('grill')) return '🥩';
    if (lowerName.includes('fish') || lowerName.includes('seafood')) return '🐟';
    return '🍽️';
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
