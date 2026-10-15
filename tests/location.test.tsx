import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LocationPicker } from '../src/components/LocationPicker';
describe('listing map selection',()=>{
  it('does not treat empty coordinates as 0,0',()=>{
    render(<LocationPicker value="" onChange={vi.fn()}/>);
    expect(screen.queryByTitle('Pratinjau peta titik lokasi')).toBeNull();
    expect((screen.getByRole('button',{name:'Simpan titik'}) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByRole('spinbutton',{name:'Lintang'}),{target:{value:'1.3'}});
    expect((screen.getByRole('button',{name:'Simpan titik'}) as HTMLButtonElement).disabled).toBe(true);
  });
  it('updates coordinates when a different listing is opened',()=>{
    const {rerender}=render(<LocationPicker value="https://www.google.com/maps/search/?api=1&query=1.3,124.8" onChange={vi.fn()}/>);
    expect((screen.getByRole('spinbutton',{name:'Lintang'}) as HTMLInputElement).value).toBe('1.3');
    rerender(<LocationPicker value="https://www.google.com/maps/search/?api=1&query=-6.2,106.8" onChange={vi.fn()}/>);
    expect((screen.getByRole('spinbutton',{name:'Lintang'}) as HTMLInputElement).value).toBe('-6.2');
  });
});
