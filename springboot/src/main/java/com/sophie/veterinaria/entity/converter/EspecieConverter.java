package com.sophie.veterinaria.entity.converter;

import com.sophie.veterinaria.entity.Mascota;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class EspecieConverter implements AttributeConverter<Mascota.Especie, String> {
  @Override
  public String convertToDatabaseColumn(Mascota.Especie attribute) {
    if (attribute == null) return null;
    return attribute.name();
  }

  @Override
  public Mascota.Especie convertToEntityAttribute(String dbData) {
    if (dbData == null) return Mascota.Especie.otro;
    String v = dbData.trim().toLowerCase();
    try { return Mascota.Especie.valueOf(v); } catch (Exception e) { return Mascota.Especie.otro; }
  }
}